const { Resend } = require('resend');
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend('re_YqyodMpc_Jp2rpL54Q8xXnNz2CVkygUEx');

const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: "Todo App <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
