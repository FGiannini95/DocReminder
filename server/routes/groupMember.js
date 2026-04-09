var express = require("express");
var router = express.Router();
const groupMemberController = require("../controllers/groupMemberController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { isGroupAdmin } = require("../middleware/isGroupAdmin");
const { isGroupMember } = require("../middleware/isGroupMember");

// base path http://localhost:3000/groups
router.delete(
  "/:groupId/delete-member/:userId",
  authenticateToken,
  isGroupAdmin,
  groupMemberController.removeMember,
);
router.delete(
  "/:groupId/leave",
  authenticateToken,
  isGroupMember,
  groupMemberController.leaveGroup,
);
router.post(
  "/:groupId/invite-member",
  authenticateToken,
  isGroupAdmin,
  groupMemberController.inviteMember,
);

module.exports = router;
