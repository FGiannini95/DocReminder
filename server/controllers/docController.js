const db = require("../config/db");
const isDev = process.env.NODE_ENV === "development";

class docController {
  addDocument = async (req, res) => {
    const data = req.body;
    if (!data.type || !data.expiry_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const insertDocument = `
        INSERT INTO document 
            (user_id, type, name, document_number, expiry_date, reminder_days, personal_note) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(insertDocument, [
        req.user.userId,
        data.type,
        data.name,
        data.document_number || null,
        data.expiry_date,
        JSON.stringify(data.reminder_days),
        data.personal_note || null,
      ]);

      return res.status(201).json({ documentId: result.insertId });
    } catch (err) {
      res
        .status(500)
        .json({ message: isDev ? err.message : "Internal server error" });
    }
  };

  editDocument = async (req, res) => {
    console.log("Hi froma addDoc");
  };

  deleteDocument = async (req, res) => {
    console.log("Hi froma addDoc");
  };

  getOneDocument = async (req, res) => {
    const { id: document_id } = req.params;

    try {
      const selectOneDocument = `
        SELECT 
          document_id AS documentId,
          type,
          name,
          document_number AS documentNumber,
          expiry_date AS expiryDate,
          reminder_days AS reminderDays,
          personal_note AS personalNote
        FROM document
        WHERE document_id = ?
      `;

      const [rows] = await db.query(selectOneDocument, [document_id]);
      const document = rows[0];

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      return res.status(200).json(document);
    } catch (err) {
      res.status(500).json({ message: "Document not found" });
    }
  };

  getAllDocument = async (req, res) => {
    const userId = req.user.userId;

    try {
      const selectAllDocuments = `
        SELECT 
          document_id AS documentId,
          type,
          name,
          document_number AS documentNumber,
          expiry_date AS expiryDate,
          reminder_days AS reminderDays,
          personal_note AS personalNote
        FROM document
        WHERE user_id = ? AND is_deleted = 0      
      `;

      const [rows] = await db.query(selectAllDocuments, [userId]);

      return res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Documents not found" });
    }
  };
}
module.exports = new docController();
