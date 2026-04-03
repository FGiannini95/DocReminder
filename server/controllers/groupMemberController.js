const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupMemberController {
  addMember = async (req, res) => {
    console.log("Hi from addMember");
  };
}

module.exports = new groupMemberController();
