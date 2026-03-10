var express = require("express");
var router = express.Router();
const docController = require("../controllers/docController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/document
router.post("/adddocument", authenticateToken, docController.addDocument);
router.put("/editdocument/:id", authenticateToken, docController.editDocument);
router.delete(
  "/deletedocument/:id",
  authenticateToken,
  docController.deleteDocument,
);
router.get("/:id", authenticateToken, docController.getOneDocument);
router.get("/", authenticateToken, docController.getAllDocument);

module.exports = router;
