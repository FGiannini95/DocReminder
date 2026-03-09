const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const db = require("../config/db");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isDev = process.env.NODE_ENV === "development";

class authController {
  sendOtp = async (req, res) => {
    const { email } = req.body;

    // Email is invalid
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      // Select user
      const selectUser = `SELECT user_id, email FROM user WHERE email = ? AND is_deleted = 0`;

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

  verifyOtp = async (req, res) => {
    const { email, otpCode } = req.body;
    const otpRegex = /^\d{6}$/;

    // Email or code are invalid
    if (
      !email ||
      !emailRegex.test(email) ||
      !otpCode ||
      !otpRegex.test(otpCode)
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      // Find user in DB
      const selectUser = `
         SELECT user_id, email, otp_code, otp_expires_at 
         FROM user 
         WHERE email = ? AND is_deleted = 0
        `;
      const [rows] = await db.query(selectUser, [email]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Verify OTP code matches and is not expired
      if (
        user.otp_code !== otpCode ||
        new Date(user.otp_expires_at) < new Date()
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Clear OTP from DB
      const clearOtp = `UPDATE user SET otp_code = NULL, otp_expires_at = NULL WHERE email = ? AND is_deleted = 0`;
      await db.query(clearOtp, [email]);
      // Generate access token
      const accessToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "10m" },
      );

      const refreshToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" },
      );
      // Save refresh token to DB
      const updateToken = `UPDATE user SET refresh_token = ? WHERE email = ? and is_deleted = 0`;
      await db.query(updateToken, [refreshToken, email]);
      // Send refresh token as httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Respond with access token
      return res.status(200).json({ accessToken, message: "Code verified" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  refresh = async (req, res) => {
    // Read refreshToken from httpOnly cookie
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: isDev ? "Token not found in cookie" : "Unauthorized",
      });
    }

    try {
      // Verify refreshToken
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      // Find user in DB
      const selectUser = `SELECT user_id, refresh_token FROM user WHERE user_id = ? AND is_deleted = 0`;
      const [rows] = await db.query(selectUser, [decoded.userId]);
      const user = rows[0];

      if (!user) {
        return res
          .status(401)
          .json({ message: isDev ? "User not found" : "Unauthorized" });
      }

      // Check refreshToken in DB matches the one in cookies
      if (user.refresh_token !== token) {
        return res
          .status(401)
          .json({ message: isDev ? "The tokens don't match" : "Unauthorized" });
      }

      // Generate new accessToken
      const newAccessToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "10m" },
      );

      // Respond with new accessToken
      return res
        .status(200)
        .json({ newAccessToken, message: "Token refreshed" });
    } catch (err) {
      return res.status(401).json({
        message: isDev ? err.message : "Unauthorized",
      });
    }
  };
}

module.exports = new authController();
