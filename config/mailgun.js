const FormData = require("form-data");
// import FormData from "form-data";
const Mailgun = require("mailgun.js");
// import Mailgun from "mailgun";

const sendSimpleMessage = async () => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });
    try {
        const data = await mg.messages.create("noreply.thecourseapp.in", {
            from: "theCourseApp Authentication Service <postman@noreply.thecourseapp.in>",
            to: [
                "Debabrata Adhikari <debabrataadhikari2311@gmail.com>, Deba Two <debu2311@yahoo.com>",
            ],
            subject: "Hello Debabrata Adhikari",
            text: "Congratulations Debabrata Adhikari, you just send an email with Mailgun! You are truly awesome!",
        });
        console.log(data);
    } catch (err) {
        console.log(err);
    }
};

const sendSimpleMail = async (options) => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });
    try {
        const data = await mg.messages.create("noreply.thecourseapp.in", {
            from: "theCourseApp Authentication Service <postman@noreply.thecourseapp.in>",
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log(data);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    sendSimpleMessage,
    sendSimpleMail,
};
