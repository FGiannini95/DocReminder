const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupController {
  addGroup = async (req, res) => {
    // extract name and icon from request body
    // extract userId from req.user

    // if name is missing, return 400

    try {
      // insert new group into private_groups with name, icon, admin_id
      // return 201 with the new group id and name
    } catch (err) {
      // return 500
    }
  };

  getOneGroup = async (req, res) => {
    console.log("Hi from getOneGroup");
  };
  getAllGroup = async (req, res) => {
    console.log("Hi from getAllGroup");
  };
  editGroup = async (req, res) => {
    console.log("Hi from editGroup");
  };
  deleteGroup = async (req, res) => {
    console.log("Hi from deleteGroup");
  };
}

module.exports = new groupController();
