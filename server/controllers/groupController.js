const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupController {
  addGroup = async (req, res) => {
    console.log("Hi from addGroup");
  };
}

module.exports = new groupController();
