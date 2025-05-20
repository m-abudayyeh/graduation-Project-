

const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // 'gmail'
  host: process.env.EMAIL_HOST,       // 'smtp.gmail.com'
  port: process.env.EMAIL_PORT,       // 587
  secure: false,                      // false مع Gmail و 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email connection error:', error);
  } else {
    console.log('Email server is ready to take messages');
  }
});

/**
 * Send email
 */
exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `Factory Maintenance <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text || '',
    html: options.html || '',
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send verification email
 */
exports.sendVerificationEmail = async (user, token) => {
  const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
  return this.sendEmail({
    to: user.email,
    subject: 'Email Verification - Factory Maintenance',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Verify Your Email Address</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for registering with Factory Maintenance. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If you did not create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send password reset email
 */
exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `http://localhost:5173/reset-password/${token}`;

  return this.sendEmail({
    to: user.email,
    subject: 'Password Reset - Factory Maintenance',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Reset Your Password</h2>
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send new work order notification
 */
exports.sendWorkOrderNotification = async (user, workOrder) => {
  const workOrderUrl = `${process.env.FRONTEND_URL}/work-orders/${workOrder.id}`;

  return this.sendEmail({
    to: user.email,
    subject: `New Work Order Assigned: ${workOrder.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">New Work Order Assigned</h2>
        <p>Hi ${user.firstName},</p>
        <p>A new work order has been assigned to you:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Title:</strong> ${workOrder.title}</p>
          <p><strong>Priority:</strong> ${workOrder.priority}</p>
          <p><strong>Due Date:</strong> ${new Date(workOrder.dueDate).toLocaleDateString()}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${workOrderUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Work Order</a>
        </div>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

// /**
//  * Send subscription expiration reminder
//  */
// exports.sendSubscriptionReminder = async (user, company, daysRemaining) => {
//   const renewUrl = `${process.env.FRONTEND_URL}/subscription/renew`;

//   return this.sendEmail({
//     to: user.email,
//     subject: `Subscription Expiring Soon - ${daysRemaining} days remaining`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #FF5E14;">Subscription Expiring Soon</h2>
//         <p>Hi ${user.firstName},</p>
//         <p>Your subscription for ${company.name} will expire in <strong>${daysRemaining} days</strong>.</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${renewUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Renew Subscription</a>
//         </div>
//         <p>To avoid service interruption, please renew your subscription before it expires.</p>
//         <p>Regards,<br>Factory Maintenance Team</p>
//       </div>
//     `,
//   });
// };

/**
 * Send subscription expiration reminder
 */
exports.sendSubscriptionReminder = async (user, company, daysRemaining) => {
  const renewUrl = `${process.env.FRONTEND_URL}/dashboard/subscription/renew`;

  return this.sendEmail({
    to: user.email,
    subject: `Subscription Expiring Soon - ${daysRemaining} days remaining`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Subscription Expiring Soon</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your ${company.subscriptionType} subscription for ${company.name} will expire in <strong>${daysRemaining} days</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${renewUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Renew Subscription</a>
        </div>
        <p>To avoid service interruption, please renew your subscription before it expires.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send trial expiration reminder
 */
exports.sendTrialExpirationReminder = async (user, company, daysRemaining) => {
  const subscribeUrl = `${process.env.FRONTEND_URL}/dashboard/subscription/checkout`;

  return this.sendEmail({
    to: user.email,
    subject: `Free Trial Ending Soon - ${daysRemaining} days remaining`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Free Trial Ending Soon</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your free trial for ${company.name} will end in <strong>${daysRemaining} days</strong>.</p>
        <p>Choose a subscription plan to continue enjoying all the features of our service:</p>
        <ul style="margin: 20px 0;">
          <li><strong>Monthly Plan:</strong> $20/month</li>
          <li><strong>Annual Plan:</strong> $216/year ($18/month - save 10%)</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${subscribeUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Subscribe Now</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send trial expired notification
 */
exports.sendTrialExpiredNotification = async (user) => {
  const subscribeUrl = `${process.env.FRONTEND_URL}/dashboard/subscription/checkout`;

  return this.sendEmail({
    to: user.email,
    subject: 'Your Free Trial Has Expired',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Your Free Trial Has Expired</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your free trial period has ended. To continue using our service and access all features, please select a subscription plan:</p>
        <ul style="margin: 20px 0;">
          <li><strong>Monthly Plan:</strong> $20/month</li>
          <li><strong>Annual Plan:</strong> $216/year ($18/month - save 10%)</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${subscribeUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Subscribe Now</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send subscription confirmation
 */
exports.sendSubscriptionConfirmation = async (user, planType, endDate) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
  const formattedEndDate = endDate.toLocaleDateString();

  return this.sendEmail({
    to: user.email,
    subject: 'Subscription Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Subscription Confirmed</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for subscribing to our service!</p>
        <p>Your <strong>${planType} subscription</strong> has been successfully activated and will be valid until <strong>${formattedEndDate}</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Dashboard</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send subscription renewal confirmation
 */
exports.sendSubscriptionRenewalConfirmation = async (user, planType, endDate) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
  const formattedEndDate = endDate.toLocaleDateString();

  return this.sendEmail({
    to: user.email,
    subject: 'Subscription Renewed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Subscription Renewed</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your <strong>${planType} subscription</strong> has been successfully renewed and will be valid until <strong>${formattedEndDate}</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Dashboard</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send payment failure notification
 */
exports.sendPaymentFailureNotification = async (user, company) => {
  const updatePaymentUrl = `${process.env.FRONTEND_URL}/dashboard/subscription/payment`;

  return this.sendEmail({
    to: user.email,
    subject: 'Payment Failed - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Payment Failed</h2>
        <p>Hi ${user.firstName},</p>
        <p>We were unable to process your subscription payment for ${company.name}.</p>
        <p>To maintain your access to our services, please update your payment method:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${updatePaymentUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Update Payment Method</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send subscription cancellation notification
 */
exports.sendSubscriptionCancellationNotification = async (user, accessUntil) => {
  const resubscribeUrl = `${process.env.FRONTEND_URL}/dashboard/subscription/checkout`;
  const formattedDate = accessUntil.toLocaleDateString();

  return this.sendEmail({
    to: user.email,
    subject: 'Subscription Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Subscription Cancelled</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your subscription has been cancelled as requested. You will continue to have access to our services until <strong>${formattedDate}</strong>.</p>
        <p>If you change your mind and would like to reactivate your subscription:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resubscribeUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Resubscribe</a>
        </div>
        <p>We'd love to hear your feedback on how we can improve our service for you.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};

/**
 * Send subscription expired notification
 */
exports.sendSubscriptionExpiredNotification = async (user) => {
  const renewUrl = `${process.env.FRONTEND_URL}/dashboard/subscription/renew`;

  return this.sendEmail({
    to: user.email,
    subject: 'Your Subscription Has Expired',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Your Subscription Has Expired</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your subscription has expired. To continue using our service and access all features, please renew your subscription:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${renewUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Renew Now</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};