var express = require("express");
var router = express.Router();
const groupMemberController = require("../controllers/groupMemberController");

// base path http://localhost:3000/groups
router.post("/add-member", groupMemberController.addMember);

module.exports = router;
