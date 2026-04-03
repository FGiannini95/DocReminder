var express = require("express");
var router = express.Router();
const groupDependentController = require("../controllers/groupDependentController");

// base path http://localhost:3000/groups
router.post("/add-dependent", groupDependentController.addDependent);

module.exports = router;
