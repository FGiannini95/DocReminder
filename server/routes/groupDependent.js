var express = require("express");
var router = express.Router();
const groupDependentController = require("../controllers/groupDependentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { isGroupMember } = require("../middleware/isGroupMember");

// base path http://localhost:3000/groups
router.post(
  "/:groupId/add-dependent",
  authenticateToken,
  isGroupMember,
  groupDependentController.addDependent,
);
router.delete(
  "/:groupId/delete-dependent/:group_dependents_id",
  authenticateToken,
  isGroupMember,
  groupDependentController.removeDependent,
);

module.exports = router;
