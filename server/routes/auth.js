var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

// base path http://localhost:3000/auth
router.post("/otp", authController.test1);
router.post("/otp/verify", authController.test2);

module.exports = router;
