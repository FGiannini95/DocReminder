var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

// base path http://localhost:3000/auth
router.post("/otp", authController.sendOtp);
router.post("/otp/verify", authController.verifyOtp);

module.exports = router;
