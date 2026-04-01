var express = require("express");
var router = express.Router();
const groupController = require("../controllers/groupController");

// base path http://localhost:3000/groups
router.post("/add-group", groupController.addGroup);

module.exports = router;
