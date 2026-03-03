const jwt = require("jsonwebtoken");
require("dotenv").config();
const connection = require("../config/db");

class authController {
  test1 = (req, res) => {
    console.log("Hi from test1");
  };
  test2 = (req, res) => {
    console.log("Hi from test2");
  };
}

module.exports = new authController();
