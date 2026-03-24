var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/auth
router.post("/otp", authController.sendOtp);
router.post("/otp/verify", authController.verifyOtp);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticateToken, authController.logOut);
router.put("/update-name", authenticateToken, authController.updateName);

router.post("/save-pin", authenticateToken, authController.createPin);
router.post("/verify-pin", authController.verifyPin);
router.put("/toggle-pin", authenticateToken, authController.togglePin);

router.post(
  "/webauthn/register/start",
  authenticateToken,
  authController.startRegisterWebAuthn,
);
router.post(
  "/webauthn/register/finish",
  authenticateToken,
  authController.finishRegisterWebAuthn,
);
router.post("/webauthn/auth/start", authController.startAuthWebAuthn);
router.post("/webauthn/auth/finish", authController.finishAuthWebAuthn);
router.put(
  "/toggle-fingerprint",
  authenticateToken,
  authController.toggleFingerprint,
);

module.exports = router;
