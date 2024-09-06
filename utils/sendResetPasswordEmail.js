const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async (name, email, token, origin) => {
  const subject = "Reset Password ✅";

  const verifyEmail = `${origin}/user/forgot-password?token=${token}&email=${email}`;
  const message = `<p>Please reset your password by clicking on the following link : 
  <a href="${verifyEmail}">Rest Password</a> </p>`;

  const html = `<h4> Hello, ${name}</h4>
    ${message}
    `;

  return sendEmail(email, subject, html);
};

module.exports = sendResetPasswordEmail;
