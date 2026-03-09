const db = require("../config/db");
const isDev = process.env.NODE_ENV === "development";

class docController {
  addDocument = async (req, res) => {
    console.log("Hi froma addDoc");
    const data = req.body;
    if (!data.type || !data.name || !data.expiry_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const insertDocument = `
        INSERT INTO document 
            (user_id, type, name, document_number, expiry_date, reminder_days, personal_note) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await db.query(insertDocument, [
        req.user.user_id,
        data.type,
        data.name,
        data.document_number || null,
        data.expiry_date,
        JSON.stringify(data.reminder_days),
        data.personal_note || null,
      ]);
      return res.status(201).json({ message: "New document created" });
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
}
module.exports = new docController();
