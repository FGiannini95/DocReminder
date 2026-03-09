var express = require("express");
var router = express.Router();
const docController = require("../controllers/docController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/documents
router.post("/adddocument", authenticateToken, docController.addDocument);
router.put("/editdocument/:id", docController.editDocument);
router.delete("/deletedocument/:id", docController.deleteDocument);

module.exports = router;
