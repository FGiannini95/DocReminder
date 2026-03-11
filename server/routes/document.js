var express = require("express");
var router = express.Router();
const docController = require("../controllers/docController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/document
router.post("/add-document", authenticateToken, docController.addDocument);
router.put("/edit-document/:id", authenticateToken, docController.editDocument);
router.delete(
  "/delete-document/:id",
  authenticateToken,
  docController.deleteDocument,
);
router.get("/:id", authenticateToken, docController.getOneDocument);
router.get("/", authenticateToken, docController.getAllDocument);

module.exports = router;
