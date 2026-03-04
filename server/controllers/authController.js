const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const db = require("../config/db");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      // Save OTP to DB
      const updateOtp = `UPDATE user SET otp_code = ?, otp_expires_at = ? WHERE email = ? AND is_deleted = 0`;
      await db.query(updateOtp, [otpCode, otpExpiry, email]);
      // Send email
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: "Tu código de acceso a DocReminder",
        text: `Tu código de acceso es: ${otpCode}. Válido durante 10 minutos.`,
      };

      await sgMail.send(msg);

      // Respond
      return res.status(200).json({ message: "Access code sent" });
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
