const { sendSimpleMail } = require("../config/mailgun");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

const sendResetPasswordLink = async (userAuthRecord) => {
    const { userEmail, userId } = userAuthRecord;
    const verificationToken = userAuthRecord.generatePasswordResetToken();
    await userAuthRecord.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/reset-password?token=${verificationToken}&id=${userId}`;

    const signedToken = jwt.sign(
        { userId: userId, token: verificationToken },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
    );

    const signedUrl = `${process.env.FRONTEND_URL}/reset-password?signature=${signedToken}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Set New Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 2px dashed gray;
          }
          .header {
            background: black;
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px;
          }
          .verification-box {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            word-break: break-all;
          }
          .button {
            display: inline-block;
            background: black;
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          .link-expires {
            color: #e74c3c;
            font-weight: 600;
          }
          .token-display {
            font-family: 'Courier New', monospace;
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            margin: 10px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Set your new password</h1>
            <p style="opacity: 0.9; margin-top: 10px;">Password Reset Link</p>
          </div>

          <div class="content">
            <h2>Hi ${userEmail || "there"},</h2>
            <p>You can change your password by clicking the link below</p>

            <div style="text-align: center;">
            <a href="https://${signedUrl}"
               target="_blank"
               style="
                 display:inline-block;
                 padding:12px 24px;
                 font-family: Arial, sans-serif;
                 font-size:16px;
                 color:#ffffff;
                 background-color:#2563eb;
                 text-decoration:none;
                 border-radius:6px;
                 font-weight:bold;
               ">
               Verify Email Address
            </a>
            </div>

            <div class="verification-box">
              <p style="margin: 0; color: #666;">
                <strong>Or copy this link:</strong><br>
                <span style="font-size: 14px; color: #3498db;">${signedUrl}</span>
              </p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link expires in <span class="link-expires">1 hour</span></li>
                <li>It can only be used <strong>once</strong></li>
                <li>Do not share this link with anyone</li>
                <li>If you didn't create this account, ignore this email</li>
              </ul>
            </div>

            <p>If the button doesn't work, copy and paste the URL above into your browser's address bar.</p>

            <p>Need help? <a href="mailto:support@thecourseapp.in">Contact our support team</a> or reply to this email.</p>
          </div>

          <div class="footer">
            <p>This email was sent to <strong>${userEmail}</strong></p>
            <p>© ${new Date().getFullYear()} CourseApp. All rights reserved.</p>
            <p style="font-size: 12px; opacity: 0.7;">
              <a href="https://thecourseapp.in/privacy" style="color: #666;">Privacy Policy</a> •
              <a href="https://thecourseapp.in/unsubscribe" style="color: #666;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
  Set a new password

  Hi ${userEmail || "there"},

  To change your passowrd please go to the following link:

  ${signedUrl}

  This link expires in an hour and can only be used once.

  If you didn't create this account, please ignore this email.

  Best regards,
  The CourseApp Team

  © ${new Date().getFullYear()} CourseApp. All rights reserved.
    `;

    return await sendSimpleMail({
        to: userEmail,
        subject: "Reset Your Account's Password",
        text: text,
        html: html,
    });
};

const sendVerificationEmail = async (userAuthRecord) => {
    const { userEmail, userId } = userAuthRecord;
    const verificationToken = userAuthRecord.generateEmailVerificationToken();
    await userAuthRecord.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&id=${userId}`;

    //Optional: sign the URL with JWT for extra security
    const signedToken = jwt.sign(
        { userId: userId, token: verificationToken },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
    );

    const signedUrl = `${process.env.FRONTEND_URL}/verify-email?signature=${signedToken}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 2px dashed gray;
          }
          .header {
            background: black;
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px;
          }
          .verification-box {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            word-break: break-all;
          }
          .button {
            display: inline-block;
            background: black;
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          .link-expires {
            color: #e74c3c;
            font-weight: 600;
          }
          .token-display {
            font-family: 'Courier New', monospace;
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            margin: 10px 0;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email Address</h1>
            <p style="opacity: 0.9; margin-top: 10px;">Complete your registration for CourseApp</p>
          </div>

          <div class="content">
            <h2>Hi ${userEmail || "there"},</h2>
            <p>Thank you for signing up for CourseApp! To complete your registration and access all features, please verify your email address by clicking the button below:</p>

            <div style="text-align:center; margin: 20px 0;">
              <a href="https://${signedUrl}"
                 target="_blank"
                 style="
                   display:inline-block;
                   padding:12px 24px;
                   font-family: Arial, sans-serif;
                   font-size:16px;
                   color:#ffffff;
                   background-color:#2563eb;
                   text-decoration:none;
                   border-radius:6px;
                   font-weight:bold;
                 ">
                 Verify Email Address
              </a>
            </div>


            <div class="verification-box">
              <p style="margin: 0; color: #666;">
                <strong>Or copy this link:</strong><br>
                <span style="font-size: 14px; color: #3498db;">${signedUrl}</span>
              </p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link expires in <span class="link-expires">24 hours</span></li>
                <li>It can only be used <strong>once</strong></li>
                <li>Do not share this link with anyone</li>
                <li>If you didn't create this account, ignore this email</li>
              </ul>
            </div>

            <p>If the button doesn't work, copy and paste the URL above into your browser's address bar.</p>

            <p>Need help? <a href="mailto:support@thecourseapp.in">Contact our support team</a> or reply to this email.</p>
          </div>

          <div class="footer">
            <p>This email was sent to <strong>${userEmail}</strong></p>
            <p>© ${new Date().getFullYear()} CourseApp. All rights reserved.</p>
            <p style="font-size: 12px; opacity: 0.7;">
              <a href="https://thecourseapp.in/privacy" style="color: #666;">Privacy Policy</a> •
              <a href="https://thecourseapp.in/unsubscribe" style="color: #666;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    // Plain text version (important for email clients)
    const text = `
  Verify Your Email Address

  Hi ${userEmail || "there"},

  Thank you for signing up for CourseApp! To complete your registration, please click the link below:

  ${signedUrl}

  This link expires in 24 hours and can only be used once.

  If you didn't create this account, please ignore this email.

  Best regards,
  The CourseApp Team

  © ${new Date().getFullYear()} CourseApp. All rights reserved.
    `;

    return await sendSimpleMail({
        to: userEmail,
        subject: "Verify your email for theCourseApp",
        text: text,
        html: html,
    });
};

module.exports = {
    sendVerificationEmail,
    sendResetPasswordLink,
};
