const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupDependentController {
  addDependent = async (req, res) => {
    console.log("Hi from addDependent");
  };
}

module.exports = new groupDependentController();
