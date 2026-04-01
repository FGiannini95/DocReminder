const sendReminderEmail = require("./mailerService");
const db = require("../config/db");

// Queries all documents that need a reminder today
async function getDocumentsDueToday() {
  const selectDocuments = `
      SELECT document.*, user.email, user.displayName
      FROM document
      JOIN user ON document.user_id = user.user_id
      WHERE document.is_deleted = 0 
        AND user.is_deleted = 0
        AND user.email_notifications = 1
        AND JSON_CONTAINS(document.reminder_days, CAST(DATEDIFF(document.expiry_date, CURDATE()) AS JSON))
    `;

  const [rows] = await db.query(selectDocuments);
  return rows;
}

// Loops through due documents and sends reminder emails
async function sendDailyReminders() {
  const documents = await getDocumentsDueToday();
  if (documents.length === 0) {
    return;
  }

  for (const doc of documents) {
    try {
      // Calculate days left for this document
      const daysLeft = Math.ceil(
        (new Date(doc.expiry_date) - new Date()) / (1000 * 60 * 60 * 24),
      );

      await sendReminderEmail(
        doc.email,
        doc.displayName,
        doc.user_id,
        doc.name,
        doc.type,
        doc.expiry_date,
        daysLeft,
      );
    } catch (err) {
      console.error(
        `Failed to send reminder for document ${doc.document_id}`,
        err.message,
      );
    }
  }
}

module.exports = sendDailyReminders;
