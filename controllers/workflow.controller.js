import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [5, 7, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionsId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionsId);

  if (!subscription || subscription.status !== "active") {
    console.log("Subscription not active");
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log("Renewal date has passed. stopping workflow");
    return;
  }

  console.log("Subscription is active with future renewal date");

  for (const daysbefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysbefore, "day");

    // Sleep first if the reminder date is in the future
    if (reminderDate.isAfter(dayjs())) {
      console.log(`Sleeping until ${daysbefore}-day reminder at ${reminderDate}`);
      await sleepUntilReminder(
        context,
        `${daysbefore}_days_before`,
        reminderDate
      );
    }

    // Always trigger the reminder after sleeping (or if date already passed)
    console.log(`Triggering ${daysbefore}-day reminder`);
    await triggerReminder(context, `${daysbefore}_days_before`, subscription);
  }

  console.log("All reminders processed");
});

const fetchSubscription = async (context, subscriptionsId) => {
  return await context.run("get subscription", async () => {
    console.log("Fetching subscription from database");
    return Subscription.findById(subscriptionsId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date.format("YYYY-MM-DD")}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log("===================================");
    console.log(`TRIGGERING: ${label} reminder`);
    console.log(`For: ${subscription.user.email}`);
    console.log("===================================");

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription: subscription,
    });
  });
};