const nodemailer = require("nodemailer");

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smpt.gmail.com",
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true", //true for 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_SMTP_PASSWORD, //16 char app passwd
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
};

const testConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log("SMTP connection established");
        return true;
    } catch (error) {
        console.error("SMTP connection failed", error.message);
        return false;
    }
};

const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from:
                process.env.EMAIL_FROM ||
                `"theCourseApp" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            // attachments if needed
            attachments: options.attachments || [],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email send: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email send error", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    createTransporter,
    testConnection,
    sendEmail,
};
