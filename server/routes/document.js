var express = require("express");
var router = express.Router();
const docController = require("../controllers/docController");
import { authenticateToken } from "../middleware/authMiddleware.js";

// base path http://localhost:3000/document
router.post("/adddocument", authenticateToken, docController.addDocument);
router.put("/editdocument/:id", docController.editDocument);
router.put("/deletdocument/:id", docController.deleteDocument);
