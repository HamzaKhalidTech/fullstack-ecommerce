// ======================================================
// IMPORTS
// ======================================================

import nodeMailer from "nodemailer";


// ======================================================
// SEND EMAIL UTILITY
// ======================================================

export const sendEmail = async ({
  email,
  subject,
  message,
}) => {

  // ======================================================
  // CREATE TRANSPORTER
  // ======================================================

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),

    // ======================================================
    // AUTH CONFIG
    // ======================================================

    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // ======================================================
  // MAIL OPTIONS
  // ======================================================

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: message,
  };

  // ======================================================
  // SEND EMAIL
  // ======================================================

  await transporter.sendMail(mailOptions);
};