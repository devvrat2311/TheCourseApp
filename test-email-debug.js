// test-email-debug.js
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== ENVIRONMENT CHECK ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
console.log('EMAIL_SMTP_PASSWORD:', process.env.EMAIL_SMTP_PASSWORD ?
  `✓ Set (${process.env.EMAIL_SMTP_PASSWORD.length} chars)` : '✗ Missing');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com (default)');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');

// Test connection
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
  debug: true,
  logger: true,
});

console.log('\n=== TESTING CONNECTION ===');
transporter.verify(function(error, success) {
  if (error) {
    console.log('✗ Connection failed:', error.message);

    // Specific error handling
    if (error.code === 'EAUTH' && error.command === 'API') {
      console.log('\n🔧 TROUBLESHOOTING TIPS:');
      console.log('1. Ensure 2-Step Verification is enabled on your Google account');
      console.log('2. Generate a NEW app password at: https://myaccount.google.com/apppasswords');
      console.log('3. App passwords are 16 characters, no spaces');
      console.log('4. If using .env file, ensure it\'s loaded before this test');
    }
  } else {
    console.log('✓ Server is ready to take our messages');
  }
});
