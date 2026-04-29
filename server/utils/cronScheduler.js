const cron = require("node-cron");
const sendDailyReminders = require("./reminderService");

// Run every day at 9.00
cron.schedule("* * * * *", async () => {
  await sendDailyReminders();
});
