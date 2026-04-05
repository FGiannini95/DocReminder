const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");

class pinController {
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
}

module.exports = new pinController();
