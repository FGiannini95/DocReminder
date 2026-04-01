var express = require("express");
var router = express.Router();
const pinController = require("../controllers/pinController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/auth
router.post("/save-pin", authenticateToken, pinController.createPin);
router.post("/verify-pin", pinController.verifyPin);
router.put("/toggle-pin", authenticateToken, pinController.togglePin);

module.exports = router;
