const sendEmail = require("./sendEmail");

const sendVerificationEmail = async (name, email, token, origin) => {
  const subject = "Account Verification ✅";

  const verifyEmail = `${origin}/user/verify-email?token=${token}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  const html = `<h4> Hello, ${name}</h4>
    ${message}
    `;

  return sendEmail(email, subject, html);
};

module.exports = sendVerificationEmail;
