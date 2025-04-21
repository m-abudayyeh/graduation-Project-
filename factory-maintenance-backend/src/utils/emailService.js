// const nodemailer = require('nodemailer');

// // Create transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.EMAIL_PORT === '465',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// /**
//  * Send email
//  * @param {Object} options - Email options
//  * @param {String} options.to - Recipient email
//  * @param {String} options.subject - Email subject
//  * @param {String} options.text - Plain text content
//  * @param {String} options.html - HTML content
//  * @returns {Promise}
//  */
// exports.sendEmail = async (options) => {
//   const mailOptions = {
//     from: `Factory Maintenance <${process.env.EMAIL_FROM}>`,
//     to: options.to,
//     subject: options.subject,
//     text: options.text || '',
//     html: options.html || ''
//   };

//   return transporter.sendMail(mailOptions);
// };

// /**
//  * Send verification email
//  * @param {Object} user - User object
//  * @param {String} token - Verification token
//  * @returns {Promise}
//  */
// exports.sendVerificationEmail = async (user, token) => {
//   const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

//   return this.sendEmail({
//     to: user.email,
//     subject: 'Email Verification - Factory Maintenance',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #FF5E14;">Verify Your Email Address</h2>
//         <p>Hi ${user.firstName},</p>
//         <p>Thank you for registering with Factory Maintenance. Please verify your email address by clicking the button below:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${verificationUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
//         </div>
//         <p>If you did not create an account, please ignore this email.</p>
//         <p>This link will expire in 24 hours.</p>
//         <p>Regards,<br>Factory Maintenance Team</p>
//       </div>
//     `
//   });
// };

// /**
//  * Send password reset email
//  * @param {Object} user - User object
//  * @param {String} token - Reset token
//  * @returns {Promise}
//  */
// exports.sendPasswordResetEmail = async (user, token) => {
//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

//   return this.sendEmail({
//     to: user.email,
//     subject: 'Password Reset - Factory Maintenance',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #FF5E14;">Reset Your Password</h2>
//         <p>Hi ${user.firstName},</p>
//         <p>You requested a password reset. Please click the button below to set a new password:</p>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${resetUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
//         </div>
//         <p>If you did not request a password reset, please ignore this email.</p>
//         <p>This link will expire in 1 hour.</p>
//         <p>Regards,<br>Factory Maintenance Team</p>
//       </div>
//     `
//   });
// };

// /**
//  * Send new work order notification
//  * @param {Object} user - User object
//  * @param {Object} workOrder - Work order object
//  * @returns {Promise}
//  */
// exports.sendWorkOrderNotification = async (user, workOrder) => {
//   const workOrderUrl = `${process.env.FRONTEND_URL}/work-orders/${workOrder.id}`;

//   return this.sendEmail({
//     to: user.email,
//     subject: `New Work Order Assigned: ${workOrder.title}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #FF5E14;">New Work Order Assigned</h2>
//         <p>Hi ${user.firstName},</p>
//         <p>A new work order has been assigned to you:</p>
//         <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
//           <p><strong>Title:</strong> ${workOrder.title}</p>
//           <p><strong>Priority:</strong> ${workOrder.priority}</p>
//           <p><strong>Due Date:</strong> ${new Date(workOrder.dueDate).toLocaleDateString()}</p>
//         </div>
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="${workOrderUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Work Order</a>
//         </div>
//         <p>Regards,<br>Factory Maintenance Team</p>
//       </div>
//     `
//   });
// };

// /**
//  * Send subscription expiration reminder
//  * @param {Object} user - Admin user object
//  * @param {Object} company - Company object
//  * @param {Number} daysRemaining - Days remaining in subscription
//  * @returns {Promise}
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
//     `
//   });
// };

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
  const verificationUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email/${token}`;
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
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

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

/**
 * Send subscription expiration reminder
 */
exports.sendSubscriptionReminder = async (user, company, daysRemaining) => {
  const renewUrl = `${process.env.FRONTEND_URL}/subscription/renew`;

  return this.sendEmail({
    to: user.email,
    subject: `Subscription Expiring Soon - ${daysRemaining} days remaining`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5E14;">Subscription Expiring Soon</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your subscription for ${company.name} will expire in <strong>${daysRemaining} days</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${renewUrl}" style="background-color: #FF5E14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Renew Subscription</a>
        </div>
        <p>To avoid service interruption, please renew your subscription before it expires.</p>
        <p>Regards,<br>Factory Maintenance Team</p>
      </div>
    `,
  });
};
