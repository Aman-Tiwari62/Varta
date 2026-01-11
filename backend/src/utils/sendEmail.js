import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,        // your gmail
    pass: process.env.EMAIL_PASS // app password (16 chars)
  }
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"Varta" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
};
