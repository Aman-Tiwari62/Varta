import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from 'dotenv';
dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html, text }) => {
  await api.sendTransacEmail({
    sender: {
      name: "Varta",
      email: "amaniiitb27@gmail.com" // or your real email
    },    
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text
  });
};

