var express = require("express");
var router = express.Router();
const groupController = require("../controllers/groupController");

// base path http://localhost:3000/groups
router.post("/add-group", groupController.addGroup);
router.get("/:id", groupController.getOneGroup);
router.get("/", groupController.getAllGroup);
router.put("/edit-group/:id", groupController.editGroup);
router.delete("/delete-group/:id", groupController.deleteGroup);

module.exports = router;
