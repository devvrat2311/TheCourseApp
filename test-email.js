require("dotenv").config();
const nodemailer = require("nodemailer");
const { testConnection, sendEmail } = require("./config/email");
const { sendSimpleMessage } = require("./config/mailgun");

// const testMailer = async () => {
//     await testConnection();
//     await sendEmail({
//         to: "debu2311@yahoo.com",
//         subject: "Verify your email for theCourseApp",
//         text: "text test sext",
//         html: `<html><head><title>title</title></head><body><h1>Hello it works please</h1></body></html>`,
//     });
// };

// testMailer();
await sendSimpleMessage();
