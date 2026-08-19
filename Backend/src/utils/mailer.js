const nodemailer = require("nodemailer");

// Reads SMTP config from environment variables. See Backend/.env.example
// for the variables you need to set (EMAIL_HOST, EMAIL_PORT, EMAIL_USER,
// EMAIL_PASS, EMAIL_FROM, FRONTEND_URL).
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: "Password Reset - TMS Import Stock Management",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
