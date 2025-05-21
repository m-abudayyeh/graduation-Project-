const { Subscription, Company, User } = require('../models');
const { Op } = require('sequelize');
const responseHandler = require('../utils/responseHandler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../utils/emailService');
const notificationController = require('./notification.controller');
const {
  handleSuccessfulSubscription,
  handleSuccessfulRenewal,
  handleFailedPayment,
  handleSubscriptionCancellation
} = require('./handlers/stripeHandlers');
/**
 * Get subscription details for a company
 * @route GET /api/subscriptions/company/:companyId
 */
exports.getCompanySubscription = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { role, companyId: userCompanyId } = req.user;
    
    // Check access permissions
    if (parseInt(companyId) !== userCompanyId && role !== 'admin') {
      return responseHandler.error(res, 403, 'You do not have permission to access this subscription');
    }
    
    // Get company subscription details
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Get subscriptions history
    const subscriptions = await Subscription.findAll({
      where: { companyId },
      order: [['createdAt', 'DESC']]
    });
    
    const subscriptionDetails = {
      company: {
        id: company.id,
        name: company.name,
        subscriptionStatus: company.subscriptionStatus,
        subscriptionType: company.subscriptionType,
        subscriptionStartDate: company.subscriptionStartDate,
        subscriptionEndDate: company.subscriptionEndDate,
        stripeCustomerId: company.stripeCustomerId
      },
      subscriptions
    };
    
    return responseHandler.success(res, 200, 'Subscription details retrieved successfully', subscriptionDetails);
  } catch (error) {
    next(error);
  }
};

/**
 * Create free trial subscription
 * @route POST /api/subscriptions/create-trial
 */
exports.createTrialSubscription = async (req, res, next) => {
  try {
    const { companyId, id: userId } = req.user;
    
    // Get company details
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Check if company already had a trial
    const existingTrial = await Subscription.findOne({
      where: { 
        companyId,
        isTrial: true
      }
    });
    
    if (existingTrial) {
      return responseHandler.error(res, 400, 'This company has already used the free trial');
    }
    
    // Calculate trial dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days trial
    
    // Update company subscription status
    await company.update({
      subscriptionStatus: 'trial',
      subscriptionType: 'trial',
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate
    });
    
    // Create trial subscription record
    const trialSubscription = await Subscription.create({
      planType: 'monthly', 
      startDate,
      endDate,
      amount: 0, 
      currency: 'USD',
      status: 'trial',
      isTrial: true,
      trialEndDate: endDate,
      autoRenew: false,
      companyId,
      notificationPreference: 'both',
      maxUsers: 10,
      createdBy: userId,
      lastModifiedBy: userId
    });
    
    // Send notification to admin user
    await notificationController.createNotification({
      type: 'subscription',
      title: 'Trial Activated',
      message: `Your 7-day free trial has been activated and will expire on ${endDate.toLocaleDateString()}.`,
      userId,
      companyId,
      relatedType: 'Subscription'
    });
    
    return responseHandler.success(
      res, 
      200, 
      'Trial subscription activated successfully', 
      { trialSubscription }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create Stripe checkout session
 * @route POST /api/subscriptions/create-checkout-session
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { companyId, id: userId } = req.user;
    const { planType } = req.body;
    
    // Get company details
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Get user details for the customer
    const user = await User.findByPk(userId);
    
    // Set price based on plan type
    const priceId = planType === 'annual' 
      ? process.env.STRIPE_ANNUAL_PRICE_ID 
      : process.env.STRIPE_MONTHLY_PRICE_ID;
    
    // Create or retrieve Stripe customer
    let customerId = company.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        description: `Customer for ${company.name}`,
        metadata: {
          companyId: company.id
        }
      });
      
      customerId = customer.id;
      
      // Update company with Stripe customer ID
      await company.update({ stripeCustomerId: customerId });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/subscription/cancel`,
      metadata: {
        companyId: company.id,
        userId: user.id,
        planType
      }
      
      
    });
    
    return responseHandler.success(res, 200, 'Checkout session created', { sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
};


///////////////////////////////////////////////////////////////////////////////////////////////
// controllers/subscriptionController.js

exports.verifyPayment = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed or invalid session' });
    }

    // ✅ من هنا يمكنك استخراج معلومات العميل من session.metadata إذا استخدمتها عند الإنشاء
    // أو يمكنك الربط بين session.customer_email وبيانات المستخدم في قاعدة البيانات

    // مثال: تحديث حالة الاشتراك في قاعدة البيانات
    // await Subscription.update({ status: 'active' }, { where: { sessionId } });

    return res.status(200).json({ success: true, message: 'Payment verified and subscription updated' });
  } catch (error) {
    console.error('Stripe verification error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// /**
//  * Handle Stripe webhook events
//  * @route POST /api/subscriptions/webhook
//  */
// exports.handleWebhook = async (req, res, next) => {
//   try {
//     const sig = req.headers['stripe-signature'];
//     let event;
    
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.rawBody, // Note: Express needs to be configured to provide rawBody
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
    
//     // Handle the event
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object;
        
//         await handleSuccessfulSubscription(session);
//         break;
//       }
//       case 'invoice.paid': {
//         const invoice = event.data.object;
        
//         await handleSuccessfulRenewal(invoice);
//         break;
//       }
//       case 'invoice.payment_failed': {
//         const invoice = event.data.object;
        
//         await handleFailedPayment(invoice);
//         break;
//       }
//       case 'customer.subscription.deleted': {
//         const subscription = event.data.object;
        
//         await handleSubscriptionCancellation(subscription);
//         break;
//       }
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
    
//     return res.json({ received: true });
//   } catch (error) {
//     next(error);
//   }
// };


// exports.handleWebhook = async (req, res, next) => {
//   const sig = req.headers['stripe-signature'];
//   // ✅ سجل البيانات للتشخيص
//   console.log('🔍 Raw body:', req.body.toString());
//   console.log('📩 Signature header:', sig);

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body, // <-- استخدم body مباشرة
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     switch (event.type) {
//       case 'checkout.session.completed':
//         await handleSuccessfulSubscription(event.data.object);
//         break;
//       case 'invoice.paid':
//         await handleSuccessfulRenewal(event.data.object);
//         break;
//       case 'invoice.payment_failed':
//         await handleFailedPayment(event.data.object);
//         break;
//       case 'customer.subscription.deleted':
//         await handleSubscriptionCancellation(event.data.object);
//         break;
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
//   } catch (error) {
//     next(error);
//   }
// };

exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  console.log('🔍 Raw body:', req.body.toString());
  console.log('📩 Signature header:', sig);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleSuccessfulSubscription(event.data.object);
        break;
      case 'invoice.paid':
        await handleSuccessfulRenewal(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

// const handleSuccessfulSubscription = async (session) => {
//   try {
//     const { companyId, userId, planType } = session.metadata;
    
//     // Log session metadata to check the data
//     console.log('Session Metadata:', session.metadata);

//     // Retrieve subscription details from Stripe
//     const subscription = await stripe.subscriptions.retrieve(session.subscription);
//     console.log('Subscription from Stripe:', subscription); // Log subscription data
    
//     // Calculate end date
//     const startDate = new Date(subscription.current_period_start * 1000);
//     const endDate = new Date(subscription.current_period_end * 1000);
    
//     // Log to confirm that the code reached this point
//     console.log('Updating company subscription status...'); 

//     // Update company subscription status
//     await Company.update(
//       {
//         subscriptionStatus: 'active',
//         subscriptionType: planType,
//         subscriptionStartDate: startDate,
//         subscriptionEndDate: endDate
//       },
//       { where: { id: companyId } }
//     );
    
//     // Log before creating the subscription record
//     console.log('Creating subscription record...');

//     // Create subscription record
//     await Subscription.create({
//       planType,
//       startDate,
//       endDate,
//       amount: planType === 'annual' ? 216 : 20,
//       currency: 'USD',
//       status: 'active',
//       isTrial: false, 
//       stripeSubscriptionId: subscription.id,
//       stripePaymentIntentId: session.payment_intent,
//       autoRenew: true,
//       companyId,
//       notificationPreference: 'both',
//       maxUsers: 10,
//       createdBy: userId,
//       lastModifiedBy: userId
//     });
    
//     // Send notification to admin user
//     await notificationController.createNotification({
//       type: 'subscription',
//       title: 'Subscription Activated',
//       message: `Your ${planType} subscription has been successfully activated and will expire on ${endDate.toLocaleDateString()}.`,
//       userId,
//       companyId,
//       relatedType: 'Subscription'
//     });
    
//     // Send confirmation email
//     const user = await User.findByPk(userId);
//     if (user) {
//       // Send email notification about successful subscription
//       await emailService.sendSubscriptionConfirmation(user, planType, endDate);
//     }
//   } catch (error) {
//     console.error('Error handling successful subscription:', error);
//   }
// };


// /**
//  * Handle failed payment
//  * @private
//  */
// const handleFailedPayment = async (invoice) => {
//   try {
//     // Get customer ID from invoice
//     const customerId = invoice.customer;
    
//     // Find company with this Stripe customer ID
//     const company = await Company.findOne({
//       where: { stripeCustomerId: customerId }
//     });
    
//     if (!company) {
//       console.error('Company not found for Stripe customer:', customerId);
//       return;
//     }
    
//     // Find subscription record
//     const subscription = await Subscription.findOne({
//       where: { 
//         companyId: company.id,
//         status: 'active' 
//       },
//       order: [['createdAt', 'DESC']]
//     });
    
//     // Find admin users to notify
//     const adminUsers = await User.findAll({
//       where: {
//         companyId: company.id,
//         role: 'admin'
//       }
//     });
    
//     // Send notifications to admin users
//     for (const admin of adminUsers) {
//       await notificationController.createNotification({
//         type: 'subscription',
//         title: 'Payment Failed',
//         message: 'Your subscription payment has failed. Please update your payment method to avoid service interruption.',
//         userId: admin.id,
//         companyId: company.id,
//         relatedType: 'Subscription'
//       });
      
//       // Send email notification about failed payment
//       await emailService.sendPaymentFailureNotification(admin, company);
//     }
    
//     // Update lastNotificationSent field
//     if (subscription) {
//       await subscription.update({
//         lastNotificationSent: new Date()
//       });
//     }
//   } catch (error) {
//     console.error('Error handling failed payment:', error);
//   }
// };

// /**
//  * Handle subscription cancellation
//  * @private
//  */
// const handleSubscriptionCancellation = async (subscription) => {
//   try {
//     // Find subscription in database
//     const subRecord = await Subscription.findOne({
//       where: { stripeSubscriptionId: subscription.id }
//     });
    
//     if (!subRecord) {
//       console.error('Subscription not found for Stripe subscription:', subscription.id);
//       return;
//     }
    
//     // Update subscription status
//     await subRecord.update({
//       status: 'cancelled',
//       autoRenew: false,
//       lastModifiedBy: subRecord.createdBy // Assuming the same user who created it is cancelling it
//     });
    
//     // Update company subscription status
//     // Keep access until current period ends
//     const company = await Company.findByPk(subRecord.companyId);
    
//     if (!company) {
//       console.error('Company not found for subscription:', subRecord.id);
//       return;
//     }
    
//     // Find admin users to notify
//     const adminUsers = await User.findAll({
//       where: {
//         companyId: company.id,
//         role: 'admin'
//       }
//     });
    
//     // Send notifications to admin users
//     for (const admin of adminUsers) {
//       await notificationController.createNotification({
//         type: 'subscription',
//         title: 'Subscription Cancelled',
//         message: `Your subscription has been cancelled. You will have access until ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}.`,
//         userId: admin.id,
//         companyId: company.id,
//         relatedType: 'Subscription'
//       });
      
//       // Send email notification about cancellation
//       await emailService.sendSubscriptionCancellationNotification(admin, new Date(subscription.current_period_end * 1000));
//     }
    
//     // Update lastNotificationSent field
//     await subRecord.update({
//       lastNotificationSent: new Date()
//     });
//   } catch (error) {
//     console.error('Error handling subscription cancellation:', error);
//   }
// };

/**
 * Cancel subscription
 * @route POST /api/subscriptions/cancel
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const { companyId, role, id: userId } = req.user;
    
    // Only admin can cancel subscription
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can cancel subscription');
    }
    
    // Get company details
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return responseHandler.error(res, 404, 'Company not found');
    }
    
    // Check if company has active subscription
    if (company.subscriptionStatus !== 'active' || !company.stripeCustomerId) {
      return responseHandler.error(res, 400, 'No active subscription to cancel');
    }
    
    // Find latest active subscription
    const subscription = await Subscription.findOne({
      where: {
        companyId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return responseHandler.error(res, 400, 'No active subscription found');
    }
    
    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    // Update subscription record
    await subscription.update({
      autoRenew: false,
      lastModifiedBy: userId
    });
    
    return responseHandler.success(
      res, 
      200, 
      'Subscription will be cancelled at the end of the current billing period'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update subscription preferences
 * @route PATCH /api/subscriptions/:id
 */
exports.updateSubscriptionPreferences = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: userId } = req.user;
    const { notificationPreference, maxUsers, autoRenew } = req.body;
    
    // Only admin can update subscription preferences
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can update subscription preferences');
    }
    
    // Find subscription
    const subscription = await Subscription.findOne({
      where: {
        id,
        companyId
      }
    });
    
    if (!subscription) {
      return responseHandler.error(res, 404, 'Subscription not found');
    }
    
    // Prepare update data
    const updateData = {};
    
    if (notificationPreference) {
      updateData.notificationPreference = notificationPreference;
    }
    
    if (maxUsers) {
      updateData.maxUsers = maxUsers;
    }
    
    if (autoRenew !== undefined) {
      updateData.autoRenew = autoRenew;
      
      // If turning off auto-renew, also update subscription in Stripe
      if (autoRenew === false && subscription.stripeSubscriptionId) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      } else if (autoRenew === true && subscription.stripeSubscriptionId) {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false
        });
      }
    }
    
    // Update lastModifiedBy field
    updateData.lastModifiedBy = userId;
    
    // Update subscription
    await subscription.update(updateData);
    
    return responseHandler.success(
      res, 
      200, 
      'Subscription preferences updated successfully',
      { subscription }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Check subscription status (used by cron job)
 * @private
 */
exports.checkSubscriptionStatus = async () => {
  try {
    const today = new Date();
    
    // Check for trial periods that will expire soon (2 days)
    const twoDays = new Date();
    twoDays.setDate(twoDays.getDate() + 2);
    
    const expiringTrials = await Company.findAll({
      where: {
        subscriptionStatus: 'trial',
        subscriptionEndDate: {
          [Op.lte]: twoDays,
          [Op.gt]: today
        }
      },
      include: [
        {
          model: User,
          as: 'users',
          where: { role: 'admin' }
        }
      ]
    });
    
    // Send reminders for expiring trials
    for (const company of expiringTrials) {
      const daysRemaining = Math.ceil((company.subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
      
      // Get the latest subscription
      const trialSubscription = await Subscription.findOne({
        where: {
          companyId: company.id,
          isTrial: true,
          status: 'trial'
        },
        order: [['createdAt', 'DESC']]
      });
      
      for (const admin of company.users) {
        // Only send notification if not sent recently
        if (!trialSubscription.lastNotificationSent || 
           (new Date() - trialSubscription.lastNotificationSent) > 24 * 60 * 60 * 1000) {
          
          // Send notification
          await notificationController.createNotification({
            type: 'trial_expiring',
            title: 'Trial Ending Soon',
            message: `Your free trial will expire in ${daysRemaining} days. Please subscribe to continue using the service.`,
            userId: admin.id,
            companyId: company.id,
            relatedType: 'Subscription'
          });
          
          // Send email reminder
          await emailService.sendTrialExpirationReminder(admin, company, daysRemaining);
        }
      }
      
      // Update lastNotificationSent field
      if (trialSubscription) {
        await trialSubscription.update({
          lastNotificationSent: new Date()
        });
      }
    }
    
    // Check for expired trials
    const expiredTrials = await Company.findAll({
      where: {
        subscriptionStatus: 'trial',
        subscriptionEndDate: {
          [Op.lt]: today
        }
      }
    });
    
    // Update expired trial companies
    for (const company of expiredTrials) {
      await company.update({
        subscriptionStatus: 'expired'
      });
      
      // Update related subscriptions
      await Subscription.update(
        { 
          status: 'expired',
          lastModifiedBy: null // System update
        },
        {
          where: {
            companyId: company.id,
            status: 'trial',
            isTrial: true
          }
        }
      );
      
      // Find admin users to notify
      const adminUsers = await User.findAll({
        where: {
          companyId: company.id,
          role: 'admin'
        }
      });
      
      // Send notifications about expiration
      for (const admin of adminUsers) {
        await notificationController.createNotification({
          type: 'trial_expired',
          title: 'Trial Expired',
          message: 'Your free trial has expired. Please subscribe to continue using the service.',
          userId: admin.id,
          companyId: company.id,
          relatedType: 'Subscription'
        });
        
        // Send email about trial expiration
        await emailService.sendTrialExpiredNotification(admin);
      }
    }
    
    // Find companies with subscriptions that will expire in 7 days
    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() + 7);
    
    const expiringCompanies = await Company.findAll({
      where: {
        subscriptionStatus: 'active',
        subscriptionEndDate: {
          [Op.lte]: sevenDays,
          [Op.gt]: today
        }
      },
      include: [
        {
          model: User,
          as: 'users',
          where: { role: 'admin' }
        }
      ]
    });
    
    // Send reminders for expiring subscriptions
    for (const company of expiringCompanies) {
      const daysRemaining = Math.ceil((company.subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
      
      // Get the latest subscription
      const subscription = await Subscription.findOne({
        where: {
          companyId: company.id,
          status: 'active'
        },
        order: [['createdAt', 'DESC']]
      });
      
      // Only send notification if notification preference is set and not sent recently
      if (subscription && 
          subscription.notificationPreference !== 'none' && 
          (!subscription.lastNotificationSent || 
          (new Date() - subscription.lastNotificationSent) > 24 * 60 * 60 * 1000)) {
        
        for (const admin of company.users) {
          // Send notification
          await notificationController.createNotification({
            type: 'subscription_expiring',
            title: 'Subscription Expiring Soon',
            message: `Your subscription will expire in ${daysRemaining} days. Please renew to avoid service interruption.`,
            userId: admin.id,
            companyId: company.id,
            relatedType: 'Subscription'
          });
          
          // Send email reminder based on preference
          if (subscription.notificationPreference === 'email' || subscription.notificationPreference === 'both') {
            await emailService.sendSubscriptionReminder(admin, company, daysRemaining);
          }
        }
        
        // Update lastNotificationSent field
        await subscription.update({
          lastNotificationSent: new Date()
        });
      }
    }
    
    // Find expired subscriptions
    const expiredCompanies = await Company.findAll({
      where: {
        subscriptionStatus: 'active',
        subscriptionEndDate: {
          [Op.lt]: today
        }
      }
    });
    
    // Update expired companies
    for (const company of expiredCompanies) {
      await company.update({
        subscriptionStatus: 'expired'
      });
      
      // Update related subscriptions
      await Subscription.update(
        { 
          status: 'expired',
          lastModifiedBy: null // System update
        },
        {
          where: {
            companyId: company.id,
            status: 'active'
          }
        }
      );
      
      // Find admin users to notify
      const adminUsers = await User.findAll({
        where: {
          companyId: company.id,
          role: 'admin'
        }
      });
      
      // Get the latest subscription for notification preferences
      const subscription = await Subscription.findOne({
        where: {
          companyId: company.id,
          status: 'expired'
        },
        order: [['updatedAt', 'DESC']]
      });
      
      // Send notifications about expiration
      for (const admin of adminUsers) {
        await notificationController.createNotification({
          type: 'subscription_expired',
          title: 'Subscription Expired',
          message: 'Your subscription has expired. Please renew to regain full access to the system.',
          userId: admin.id,
          companyId: company.id,
          relatedType: 'Subscription'
        });
        
        // Send email about expiration based on preference
        if (subscription && (subscription.notificationPreference === 'email' || subscription.notificationPreference === 'both')) {
          await emailService.sendSubscriptionExpiredNotification(admin);
        }
      }
      
      // Update lastNotificationSent field
      if (subscription) {
        await subscription.update({
          lastNotificationSent: new Date()
        });
      }
    }
    
    console.log(`Checked ${expiringTrials.length} expiring trials, ${expiredTrials.length} expired trials, ${expiringCompanies.length} expiring subscriptions and ${expiredCompanies.length} expired subscriptions`);
  } catch (error) {
    console.error('Error checking subscription status:', error);
  }
};