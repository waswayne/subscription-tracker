export const emailTemplate = [
  {
    label: "5_days_before",
    generateSubject: (data) => `🔔 Reminder: Your ${data.subscriptionName} subscription renews in 5 days`,
    generateBody: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Subscription Renewal Reminder</h2>
        <p>Hello ${data.userName},</p>
        <p>Your <strong>${data.subscriptionName}</strong> subscription will renew in <strong>5 days</strong>.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Subscription Details:</h3>
          <p><strong>Plan:</strong> ${data.subscriptionName}</p>
          <p><strong>Amount:</strong> ${data.price}</p>
          <p><strong>Renewal Date:</strong> ${data.renewalDate}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        </div>
        
        <p>If you need to make any changes, please visit your account settings.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><small>This is an automated reminder from SubscriptionTracker</small></p>
        </div>
      </div>
    `
  },
  {
    label: "7_days_before",
    generateSubject: (data) => `🔔 Reminder: Your ${data.subscriptionName} subscription renews in 7 days`,
    generateBody: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Weekly Subscription Reminder</h2>
        <p>Hello ${data.userName},</p>
        <p>Your <strong>${data.subscriptionName}</strong> subscription will renew in <strong>7 days</strong>.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Subscription Details:</h3>
          <p><strong>Plan:</strong> ${data.subscriptionName}</p>
          <p><strong>Amount:</strong> ${data.price}</p>
          <p><strong>Renewal Date:</strong> ${data.renewalDate}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        </div>
        
        <p>You have a week to review or update your subscription details.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><small>This is an automated reminder from SubscriptionTracker</small></p>
        </div>
      </div>
    `
  },
  {
    label: "2_days_before",
    generateSubject: (data) => `⏰ Final Reminder: Your ${data.subscriptionName} subscription renews in 2 days`,
    generateBody: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">Final Renewal Reminder</h2>
        <p>Hello ${data.userName},</p>
        <p>Your <strong>${data.subscriptionName}</strong> subscription will renew in <strong>2 days</strong>.</p>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3>Subscription Details:</h3>
          <p><strong>Plan:</strong> ${data.subscriptionName}</p>
          <p><strong>Amount:</strong> ${data.price}</p>
          <p><strong>Renewal Date:</strong> ${data.renewalDate}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        </div>
        
        <p>This is your final reminder before automatic renewal.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><small>This is an automated reminder from SubscriptionTracker</small></p>
        </div>
      </div>
    `
  },
  {
    label: "1_days_before",
    generateSubject: (data) => `🚨 Last Chance: Your ${data.subscriptionName} subscription renews TOMORROW`,
    generateBody: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Renewal Happening Tomorrow!</h2>
        <p>Hello ${data.userName},</p>
        <p>Your <strong>${data.subscriptionName}</strong> subscription will renew <strong>TOMORROW</strong>.</p>
        
        <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3>Subscription Details:</h3>
          <p><strong>Plan:</strong> ${data.subscriptionName}</p>
          <p><strong>Amount:</strong> ${data.price}</p>
          <p><strong>Renewal Date:</strong> ${data.renewalDate}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        </div>
        
        <p>If you need to make changes, please do so today to avoid automatic charges.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><small>This is an automated reminder from SubscriptionTracker</small></p>
        </div>
      </div>
    `
  }
];

// Utility function to get template by label
export const getEmailTemplate = (label) => {
  return emailTemplate.find(template => template.label === label);
};

// Utility function to format price
export const formatPrice = (subscription) => {
  return `${subscription.currency} ${subscription.price} (${subscription.frequency})`;
};