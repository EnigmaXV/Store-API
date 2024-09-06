const nodemailer = require("nodemailer");
const nodemailerConfig = require("../utils/nodemailerConfig");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const info = await transporter.sendMail({
    from: '"Enigma 👻" <Enigma@ethereal.email>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
