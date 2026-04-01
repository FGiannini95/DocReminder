const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
} = require("@simplewebauthn/server");

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

  createPin = async (req, res) => {
    const userId = req.user.userId;
    const { pin } = req.body;

    if (!pin || pin.length < 4) {
      return res.status(400).json({ message: "Pin incorrect" });
    }

    try {
      const updatePin = `
        UPDATE user SET pin = ?, pin_enabled = true
        WHERE user_id = ? AND is_deleted = 0  
      `;

      const hashedPin = await bcrypt.hash(pin, 10);

      await db.query(updatePin, [hashedPin, userId]);

      // Generate new accessToken
      const newAccessToken = jwt.sign(
        {
          userId: req.user.userId,
          email: req.user.email,
          displayName: req.user.displayName,
          pin_enabled: true,
          fingerprint_enabled: req.user.fingerprint_enabled ?? false,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "10m" },
      );

      return res
        .status(200)
        .json({ newAccessToken, message: "Pin updated succesfully" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyPin = async (req, res) => {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const selectUser = `
        SELECT user_id, email, pin, displayName, pin_enabled, fingerprint_enabled
        FROM user 
        WHERE email = ? AND is_deleted = 0
      `;

      const [rows] = await db.query(selectUser, [email]);
      const user = rows[0];

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const pinMatch = await bcrypt.compare(pin, user.pin);
      if (!pinMatch) return res.status(401).json({ message: "Unauthorized" });

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

      return res
        .status(200)
        .json({ newAccessToken, message: "Logged succesfully" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  togglePin = async (req, res) => {
    const userId = req.user.userId;
    const { pin_enabled } = req.body;

    try {
      const updatePinStatus = `
        UPDATE user SET pin_enabled = ? WHERE user_id = ? AND is_deleted = 0
      `;

      await db.query(updatePinStatus, [pin_enabled, userId]);

      return res.status(200).json({ message: "Status updated succesfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating the toggle" });
    }
  };

  startRegisterWebAuthn = async (req, res) => {
    const userId = req.user.userId;
    const email = req.user.email;

    try {
      const selectUser = `
        SELECT user_id, email, displayName, webauthn_credentials
        FROM user 
        WHERE user_id = ? AND is_deleted = 0
      `;

      const [rows] = await db.query(selectUser, [userId]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Parse existing credentials to prevent duplicare registration
      const existingCredentials = user.webauthn_credentials
        ? JSON.parse(user.webauthn_credentials)
        : [];

      // Generate registration options for the device
      const options = await generateRegistrationOptions({
        rpName: "DocReminder",
        rpID: process.env.RP_ID || "localhost",
        userID: Buffer.from(String(userId)),
        userName: email,
        userDisplayName: user.displayName || email,
        excludeCredentials: existingCredentials.map((cred) => ({
          id: cred.id,
          type: "public-key",
        })),
        authenticatorSelection: {
          authenticatorAttachment: "platform", // use device biometrics (Face ID, fingerprint)
          userVerification: "required",
        },
      });

      // Save challenge  temporarily in db for verification
      const updateChallenge = `
        UPDATE user SET webauthn_challenge = ? WHERE user_id = ?
      `;
      await db.query(updateChallenge, [options.challenge, userId]);

      return res.status(200).json(options);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  finishRegisterWebAuthn = async (req, res) => {
    const userId = req.user.userId;
    const { registration } = req.body;

    try {
      // Get challenge from DB
      const selectUser = `
        SELECT webauthn_challenge, email, displayName, webauthn_credentials
        FROM user 
        WHERE user_id = ? AND is_deleted = 0
      `;

      const [rows] = await db.query(selectUser, [userId]);
      const user = rows[0];

      if (!user || !user.webauthn_challenge) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify registration
      const verification = await verifyRegistrationResponse({
        response: registration,
        expectedChallenge: user.webauthn_challenge,
        expectedOrigin: process.env.ORIGIN || "http://localhost:5173",
        expectedRPID: process.env.RP_ID || "localhost",
        requireUserVerification: true,
      });

      if (!verification.verified) {
        return res.status(401).json({ message: "Verification failed" });
      }

      const { credential } = verification.registrationInfo;

      // Parse existing credentials to prevent duplicare registration
      const existingCredentials = user.webauthn_credentials
        ? JSON.parse(user.webauthn_credentials)
        : [];

      // Add new credential to existing ones
      const updatedCredentials = [
        ...existingCredentials,
        {
          id: credential.id,
          publicKey: Buffer.from(credential.publicKey).toString("base64"),
          counter: credential.counter,
        },
      ];

      // Save credentials
      const updateCredentials = `
        UPDATE user SET 
          webauthn_credentials = ?, webauthn_challenge = NULL, fingerprint_enabled = true
        WHERE user_id = ?
      `;

      await db.query(updateCredentials, [
        JSON.stringify(updatedCredentials),
        userId,
      ]);

      // Generate new accessToken
      const newAccessToken = jwt.sign(
        {
          userId: req.user.userId,
          email: req.user.email,
          displayName: req.user.displayName,
          pin_enabled: req.user.pin_enabled ?? false,
          fingerprint_enabled: true,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "10m" },
      );

      return res.status(200).json({
        newAccessToken,
        message: "Fingerprint registered succesfully",
      });
    } catch (err) {
      return res.status(500).json({ message: "Unauthorized" });
    }
  };

  startAuthWebAuthn = async (req, res) => {
    const { email } = req.body;

    try {
      const selectUser = `
      SELECT user_id, email, displayName, webauthn_credentials 
      FROM user 
      WHERE email = ? AND is_deleted = 0
    `;

      const [rows] = await db.query(selectUser, [email]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!user.webauthn_credentials) {
        return res.status(401).json({ message: "Biometrics not registered" });
      }

      // Parse existing credentials to prevent duplicare registration
      const existingCredentials = user.webauthn_credentials
        ? JSON.parse(user.webauthn_credentials)
        : [];

      // Generate authentication options for the device
      const options = await generateAuthenticationOptions({
        rpID: process.env.RP_ID || "localhost",
        allowCredentials: existingCredentials.map((cred) => ({
          id: cred.id,
          type: "public-key",
        })),
        userVerification: "required",
      });

      // Save challenge  temporarily in db for verification
      const updateChallenge = `
        UPDATE user SET webauthn_challenge = ? WHERE email = ?
      `;
      await db.query(updateChallenge, [options.challenge, email]);

      return res.status(200).json(options);
    } catch (err) {
      return res.status(500).json({ message: "Unauthorized" });
    }
  };

  finishAuthWebAuthn = async (req, res) => {
    console.log("Hi from finish Auth");
  };

  toggleFingerprint = async (req, res) => {
    const userId = req.user.userId;
    const { fingerprint_enabled } = req.body;

    try {
      const updatePinStatus = `
        UPDATE user SET fingerprint_enabled = ? WHERE user_id = ? AND is_deleted = 0
      `;

      await db.query(updatePinStatus, [fingerprint_enabled, userId]);

      return res.status(200).json({ message: "Status updated succesfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating the toggle" });
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
