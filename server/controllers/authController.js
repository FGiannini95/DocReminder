const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const db = require("../config/db");

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const selectUser = `
        SELECT user_id, email FROM user WHERE email = ? AND is_deleted = 0
      `;

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
      const updateOtp = `
        UPDATE user SET otp_code = ?, otp_expires_at = ? 
        WHERE email = ? AND is_deleted = 0
      `;
      await db.query(updateOtp, [otpCode, otpExpiry, email]);
      // Send email
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: "DocReminder - Código de acceso",
        text: `Tu código de acceso es: ${otpCode}. Válido durante 10 minutos.`,
      };

      await resend.emails.send(msg);

      // Respond
      return res.status(200).json({ message: "Access code sent" });
    } catch (err) {
      console.log(err);
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
        SELECT user_id, email, displayName, otp_code, otp_expires_at, pin_enabled, fingerprint_enabled 
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
      const clearOtp = `
        UPDATE user SET otp_code = NULL, otp_expires_at = NULL 
        WHERE email = ? AND is_deleted = 0
      `;
      await db.query(clearOtp, [email]);
      // Generate access token
      const accessToken = jwt.sign(
        {
          userId: user.user_id,
          email: user.email,
          displayName: user.displayName,
          pin_enabled: user.pin_enabled ?? false,
          fingerprint_enabled: user.fingerprint_enabled ?? false,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "10m" },
      );

      const refreshToken = jwt.sign(
        {
          userId: user.user_id,
          email: user.email,
          displayName: user.displayName,
          pin_enabled: user.pin_enabled ?? false,
          fingerprint_enabled: user.fingerprint_enabled ?? false,
        },
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
      const selectUser = `
        SELECT user_id, email, refresh_token, displayName, pin_enabled, fingerprint_enabled
        FROM user WHERE user_id = ? AND is_deleted = 0
      `;
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
        {
          userId: user.user_id,
          email: user.email,
          displayName: user.displayName,
          pin_enabled: user.pin_enabled ?? false,
          fingerprint_enabled: user.fingerprint_enabled ?? false,
        },
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

  logOut = async (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out succesfully" });
  };

  updateName = async (req, res) => {
    const userId = req.user.userId;
    const { displayName } = req.body;

    if (!displayName || displayName.trim().length < 2) {
      return res.status(400).json({ message: "Minimum two characters" });
    }

    try {
      const editDisplayName = `
        UPDATE user SET displayName = ? 
        WHERE user_id = ? and is_deleted = 0
      `;

      await db.query(editDisplayName, [displayName, userId]);

      return res
        .status(200)
        .json({ message: "displayName updated succesfully" });
    } catch (err) {
      return res.status(401).json({ message: "Error during the update" });
    }
  };

  unsubscribe = async (req, res) => {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("<p>Invalid token.</p>");
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (decoded.purpose !== "unsubscribe") {
        return res.status(400).send("<p>Invalid token.</p>");
      }

      const updateNotifications = `
        UPDATE user SET email_notifications = FALSE WHERE user_id = ?
      `;

      await db.query(updateNotifications, [decoded.user_id]);

      res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 48px;">
        <h2>Dado de baja correctamente</h2>
        <p>Ya no recibirás ningún recordatorio por parte de DocReminder.</p>
      </div>
    `);
    } catch (err) {
      return res.status(400).send("<p>Token scaduto o non valido.</p>");
    }
  };
}

module.exports = new authController();
