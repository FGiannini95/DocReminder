const cron = require("node-cron");
const sendDailyReminders = require("./reminderService");

// Run every day at 9.00
cron.schedule("0 9 * * *", async () => {
  await sendDailyReminders();
});
