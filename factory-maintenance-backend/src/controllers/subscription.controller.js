const { Subscription, Company, User } = require('../models');
const responseHandler = require('../utils/responseHandler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../utils/emailService');
const notificationController = require('./notification.controller');

/**
 * Get subscription details for a company
 * @route GET /api/subscriptions/company/:companyId
 */
exports.getCompanySubscription = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { role, companyId: userCompanyId } = req.user;
    
    // Check access permissions
    if (parseInt(companyId) !== userCompanyId && role !== 'super_admin') {
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

/**
 * Handle Stripe webhook events
 * @route POST /api/subscriptions/webhook
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody, // Note: Express needs to be configured to provide rawBody
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        await handleSuccessfulSubscription(session);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        
        await handleSuccessfulRenewal(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        await handleFailedPayment(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await handleSubscriptionCancellation(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle successful subscription
 * @private
 */
const handleSuccessfulSubscription = async (session) => {
  try {
    const { companyId, userId, planType } = session.metadata;
    
    // Retrieve subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Calculate end date
    const startDate = new Date(subscription.current_period_start * 1000);
    const endDate = new Date(subscription.current_period_end * 1000);
    
    // Update company subscription status
    await Company.update(
      {
        subscriptionStatus: 'active',
        subscriptionType: planType,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate
      },
      { where: { id: companyId } }
    );
    
    // Create subscription record
    await Subscription.create({
      planType,
      startDate,
      endDate,
      amount: planType === 'annual' ? 216 : 20,
      currency: 'USD',
      status: 'active',
      stripeSubscriptionId: subscription.id,
      stripePaymentIntentId: session.payment_intent,
      autoRenew: true,
      companyId
    });
    
    // Send notification to admin user
    await notificationController.createNotification({
      type: 'subscription',
      title: 'Subscription Activated',
      message: `Your ${planType} subscription has been successfully activated and will expire on ${endDate.toLocaleDateString()}.`,
      userId,
      companyId,
      relatedType: 'Subscription'
    });
    
    // Send confirmation email
    const user = await User.findByPk(userId);
    if (user) {
      // Send email notification about successful subscription
      // Implementation would be in emailService
    }
  } catch (error) {
    console.error('Error handling successful subscription:', error);
  }
};

/**
 * Handle successful renewal
 * @private
 */
const handleSuccessfulRenewal = async (invoice) => {
  try {
    // Get customer ID from invoice
    const customerId = invoice.customer;
    
    // Find company with this Stripe customer ID
    const company = await Company.findOne({
      where: { stripeCustomerId: customerId }
    });
    
    if (!company) {
      console.error('Company not found for Stripe customer:', customerId);
      return;
    }
    
    // Retrieve subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // Calculate new end date
    const startDate = new Date(subscription.current_period_start * 1000);
    const endDate = new Date(subscription.current_period_end * 1000);
    
    // Update company subscription dates
    await company.update({
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate
    });
    
    // Create new subscription record
    await Subscription.create({
      planType: company.subscriptionType,
      startDate,
      endDate,
      amount: company.subscriptionType === 'annual' ? 216 : 20,
      currency: 'USD',
      status: 'active',
      stripeSubscriptionId: subscription.id,
      stripePaymentIntentId: invoice.payment_intent,
      autoRenew: true,
      companyId: company.id
    });
    
    // Find admin users to notify
    const adminUsers = await User.findAll({
      where: {
        companyId: company.id,
        role: 'admin'
      }
    });
    
    // Send notifications to admin users
    for (const admin of adminUsers) {
      await notificationController.createNotification({
        type: 'subscription',
        title: 'Subscription Renewed',
        message: `Your ${company.subscriptionType} subscription has been successfully renewed and will expire on ${endDate.toLocaleDateString()}.`,
        userId: admin.id,
        companyId: company.id,
        relatedType: 'Subscription'
      });
      
      // Send email notification about successful renewal
      // Implementation would be in emailService
    }
  } catch (error) {
    console.error('Error handling successful renewal:', error);
  }
};

/**
 * Handle failed payment
 * @private
 */
const handleFailedPayment = async (invoice) => {
  try {
    // Get customer ID from invoice
    const customerId = invoice.customer;
    
    // Find company with this Stripe customer ID
    const company = await Company.findOne({
      where: { stripeCustomerId: customerId }
    });
    
    if (!company) {
      console.error('Company not found for Stripe customer:', customerId);
      return;
    }
    
    // Find admin users to notify
    const adminUsers = await User.findAll({
      where: {
        companyId: company.id,
        role: 'admin'
      }
    });
    
    // Send notifications to admin users
    for (const admin of adminUsers) {
      await notificationController.createNotification({
        type: 'subscription',
        title: 'Payment Failed',
        message: 'Your subscription payment has failed. Please update your payment method to avoid service interruption.',
        userId: admin.id,
        companyId: company.id,
        relatedType: 'Subscription'
      });
      
      // Send email notification about failed payment
      // Implementation would be in emailService
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

/**
 * Handle subscription cancellation
 * @private
 */
const handleSubscriptionCancellation = async (subscription) => {
  try {
    // Find subscription in database
    const subRecord = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id }
    });
    
    if (!subRecord) {
      console.error('Subscription not found for Stripe subscription:', subscription.id);
      return;
    }
    
    // Update subscription status
    await subRecord.update({
      status: 'cancelled',
      autoRenew: false
    });
    
    // Update company subscription status
    // Keep access until current period ends
    const company = await Company.findByPk(subRecord.companyId);
    
    if (!company) {
      console.error('Company not found for subscription:', subRecord.id);
      return;
    }
    
    // Find admin users to notify
    const adminUsers = await User.findAll({
      where: {
        companyId: company.id,
        role: 'admin'
      }
    });
    
    // Send notifications to admin users
    for (const admin of adminUsers) {
      await notificationController.createNotification({
        type: 'subscription',
        title: 'Subscription Cancelled',
        message: `Your subscription has been cancelled. You will have access until ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}.`,
        userId: admin.id,
        companyId: company.id,
        relatedType: 'Subscription'
      });
      
      // Send email notification about cancellation
      // Implementation would be in emailService
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
};

/**
 * Cancel subscription
 * @route POST /api/subscriptions/cancel
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const { companyId, role } = req.user;
    
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
      autoRenew: false
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
 * Check subscription status (used by cron job)
 * @private
 */
exports.checkSubscriptionStatus = async () => {
  try {
    const today = new Date();
    
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
        
        // Send email reminder
        await emailService.sendSubscriptionReminder(admin, company, daysRemaining);
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
        { status: 'expired' },
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
        
        // Send email about expiration
        // Implementation would be in emailService
      }
    }
    
    console.log(`Checked ${expiringCompanies.length} expiring and ${expiredCompanies.length} expired subscriptions`);
  } catch (error) {
    console.error('Error checking subscription status:', error);
  }
};