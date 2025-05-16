// src/handlers/stripeHandlers.js
const { Subscription, Company, User } = require('../../models');
const notificationController = require('../notification.controller');
const emailService = require('../../utils/emailService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handleSuccessfulSubscription = async (session) => {
  try {
    const { companyId, userId, planType } = session.metadata;
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    const periodStart = subscription.current_period_start;
    const periodEnd = subscription.current_period_end;

    if (!periodStart || !periodEnd) {
      throw new Error('Missing subscription period dates from Stripe (handleSuccessfulSubscription)');
    }

    const startDate = new Date(periodStart * 1000);
    const endDate = new Date(periodEnd * 1000);

    await Company.update({
      subscriptionStatus: 'active',
      subscriptionType: planType,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate
    }, {
      where: { id: companyId }
    });

    await Subscription.create({
      planType,
      startDate,
      endDate,
      amount: planType === 'annual' ? 216 : 20,
      currency: 'USD',
      status: 'active',
      isTrial: false,
      stripeSubscriptionId: subscription.id,
      stripePaymentIntentId: session.payment_intent,
      autoRenew: true,
      companyId,
      notificationPreference: 'both',
      maxUsers: 10,
      createdBy: userId,
      lastModifiedBy: userId
    });

    await notificationController.createNotification({
      type: 'subscription',
      title: 'Subscription Activated',
      message: `Your ${planType} subscription has been successfully activated and will expire on ${endDate.toLocaleDateString()}.`,
      userId,
      companyId,
      relatedType: 'Subscription'
    });

    const user = await User.findByPk(userId);
    if (user) {
      await emailService.sendSubscriptionConfirmation(user, planType, endDate);
    }
  } catch (error) {
    console.error('Error handling successful subscription:', error);
  }
};
// const handleSuccessfulRenewal = async (invoice) => {
//   try {
//     const customerId = invoice.customer;
//     const company = await Company.findOne({ where: { stripeCustomerId: customerId } });

//     if (!company) {
//       console.error('Company not found for renewal');
//       return;
//     }

//     const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

//     const periodStart = subscription.current_period_start;
//     const periodEnd = subscription.current_period_end;

//     if (!periodStart || !periodEnd) {
//       throw new Error('Missing subscription period dates from Stripe (handleSuccessfulRenewal)');
//     }

//     const startDate = new Date(periodStart * 1000);
//     const endDate = new Date(periodEnd * 1000);

//     await company.update({
//       subscriptionStatus: 'active',
//       subscriptionStartDate: startDate,
//       subscriptionEndDate: endDate
//     });

//     await Subscription.create({
//       planType: subscription.items.data[0].price.recurring.interval === 'year' ? 'annual' : 'monthly',
//       startDate,
//       endDate,
//       amount: invoice.amount_paid / 100,
//       currency: invoice.currency.toUpperCase(),
//       status: 'active',
//       isTrial: false,
//       stripeSubscriptionId: subscription.id,
//       stripePaymentIntentId: invoice.payment_intent,
//       autoRenew: true,
//       companyId: company.id,
//       notificationPreference: 'both',
//       maxUsers: 10,
//       createdBy: null,
//       lastModifiedBy: null
//     });

//     const admins = await User.findAll({ where: { companyId: company.id, role: 'admin' } });
//     for (const admin of admins) {
//       await notificationController.createNotification({
//         type: 'subscription',
//         title: 'Subscription Renewed',
//         message: `Your subscription was renewed successfully until ${endDate.toLocaleDateString()}.`,
//         userId: admin.id,
//         companyId: company.id,
//         relatedType: 'Subscription'
//       });

//       await emailService.sendSubscriptionRenewalNotification(admin, company, endDate);
//     }
//   } catch (err) {
//     console.error('Error handling renewal:', err);
//   }
// };

// Updated version of handleSuccessfulRenewal that uses invoice.lines
const handleSuccessfulRenewal = async (invoice) => {
  try {
    const customerId = invoice.customer;
    const company = await Company.findOne({ where: { stripeCustomerId: customerId } });

    if (!company) {
      console.error('Company not found for renewal');
      return;
    }

    const subscriptionId = invoice.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const lineItem = invoice.lines?.data?.[0];
    if (!lineItem || !lineItem.period?.start || !lineItem.period?.end) {
      throw new Error('Missing subscription period dates from invoice (handleSuccessfulRenewal)');
    }

    const startDate = new Date(lineItem.period.start * 1000);
    const endDate = new Date(lineItem.period.end * 1000);

    await company.update({
      subscriptionStatus: 'active',
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate
    });

    await Subscription.create({
      planType: lineItem.price.recurring.interval === 'year' ? 'annual' : 'monthly',
      startDate,
      endDate,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'active',
      isTrial: false,
      stripeSubscriptionId: subscriptionId,
      stripePaymentIntentId: invoice.payment_intent,
      autoRenew: true,
      companyId: company.id,
      notificationPreference: 'both',
      maxUsers: 10,
      createdBy: null,
      lastModifiedBy: null
    });

    const admins = await User.findAll({ where: { companyId: company.id, role: 'admin' } });
    for (const admin of admins) {
      await notificationController.createNotification({
        type: 'subscription',
        title: 'Subscription Renewed',
        message: `Your subscription was renewed successfully until ${endDate.toLocaleDateString()}.`,
        userId: admin.id,
        companyId: company.id,
        relatedType: 'Subscription'
      });

      await emailService.sendSubscriptionRenewalNotification(admin, company, endDate);
    }
  } catch (err) {
    console.error('Error handling renewal:', err);
  }
};
/**
 * Handle failed payment (invoice.payment_failed)
 */
const handleFailedPayment = async (invoice) => {
  try {
    const customerId = invoice.customer;
    const company = await Company.findOne({ where: { stripeCustomerId: customerId } });
    if (!company) return;

    const subscription = await Subscription.findOne({
      where: { companyId: company.id, status: 'active' },
      order: [['createdAt', 'DESC']]
    });

    const admins = await User.findAll({ where: { companyId: company.id, role: 'admin' } });
    for (const admin of admins) {
      await notificationController.createNotification({
        type: 'subscription',
        title: 'Payment Failed',
        message: 'Your subscription payment failed. Please update your payment method.',
        userId: admin.id,
        companyId: company.id,
        relatedType: 'Subscription'
      });

      await emailService.sendPaymentFailureNotification(admin, company);
    }

    if (subscription) {
      await subscription.update({ lastNotificationSent: new Date() });
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

/**
 * Handle subscription cancellation
 */
const handleSubscriptionCancellation = async (subscription) => {
  try {
    const subRecord = await Subscription.findOne({ where: { stripeSubscriptionId: subscription.id } });
    if (!subRecord) return;

    await subRecord.update({
      status: 'cancelled',
      autoRenew: false,
      lastModifiedBy: subRecord.createdBy
    });

    const company = await Company.findByPk(subRecord.companyId);
    if (!company) return;

    const admins = await User.findAll({ where: { companyId: company.id, role: 'admin' } });
    for (const admin of admins) {
      await notificationController.createNotification({
        type: 'subscription',
        title: 'Subscription Cancelled',
        message: `Your subscription was cancelled. Access remains until ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}.`,
        userId: admin.id,
        companyId: company.id,
        relatedType: 'Subscription'
      });

      await emailService.sendSubscriptionCancellationNotification(admin, new Date(subscription.current_period_end * 1000));
    }

    await subRecord.update({ lastNotificationSent: new Date() });
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
};

module.exports = {
  handleSuccessfulSubscription,
  handleSuccessfulRenewal,
  handleFailedPayment,
  handleSubscriptionCancellation
};
