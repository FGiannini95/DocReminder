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

module.exports = router;
