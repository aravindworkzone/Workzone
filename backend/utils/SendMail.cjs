const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

const Transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await Transport.sendMail({
    from: `"Todo App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
