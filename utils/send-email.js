import dayjs from "dayjs";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate, formatPrice } from "./email-template.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type || !subscription) {
    throw new Error("Missing required parameters: to, type, or subscription");
  }

  const template = getEmailTemplate(type);

  if (!template) {
    throw new Error(`Invalid email type: ${type}`);
  }

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    price: formatPrice(subscription),
    paymentMethod: subscription.paymentMethod,
  };

  const htmlMessage = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: 'SubscriptionTracker <oluwese5life2@gmail.com>',
    to: to,
    subject: subject,
    html: htmlMessage,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};