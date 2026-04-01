var express = require("express");
var router = express.Router();
const webAuthnController = require("../controllers/webAuthnController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/auth
router.post(
  "/webauthn/register/start",
  authenticateToken,
  webAuthnController.startRegisterWebAuthn,
);
router.post(
  "/webauthn/register/finish",
  authenticateToken,
  webAuthnController.finishRegisterWebAuthn,
);
router.post("/webauthn/auth/start", webAuthnController.startAuthWebAuthn);
router.post("/webauthn/auth/finish", webAuthnController.finishAuthWebAuthn);
router.put(
  "/toggle-fingerprint",
  authenticateToken,
  webAuthnController.toggleFingerprint,
);

module.exports = router;
