const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../config/db");

class authController {
  sendOtp = async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Email is invalid
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      // Select user
      let selectUser = `SELECT user_id, email FROM user WHERE email = ? AND is_deleted = 0`;

      const [rows] = await db.query(selectUser, [email]);
      const user = rows[0];

      if (!user) {
        // User doesn't exist, create it
        const insertUser = `INSERT INTO user (email) VALUES (?)`;
        await db.query(insertUser, [email]);
      }
      // Generate OTP
      // Save OTP to DB
      // Send email
      // Respond
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyOtp = (req, res) => {
    console.log("body:", req.body);
    res.json({ message: "ok" });
  };
}

module.exports = new authController();
