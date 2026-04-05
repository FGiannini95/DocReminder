const jwt = require("jsonwebtoken");
const db = require("../config/db");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
} = require("@simplewebauthn/server");

class webAuthnController {
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
}

module.exports = new webAuthnController();
