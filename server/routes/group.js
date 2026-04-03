var express = require("express");
var router = express.Router();
const groupController = require("../controllers/groupController");
const { authenticateToken } = require("../middleware/authMiddleware");

// base path http://localhost:3000/groups

// anyone authenticated can create a group
router.post("/add-group", authenticateToken, groupController.addGroup);
// only members can see the group
router.get("/:id", authenticateToken, groupController.getOneGroup);
router.get("/", authenticateToken, groupController.getAllGroup);
// only admin can edit or delete
router.put("/edit-group/:id", authenticateToken, groupController.editGroup);
router.delete(
  "/delete-group/:id",
  authenticateToken,
  groupController.deleteGroup,
);

module.exports = router;
