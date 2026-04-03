const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupController {
  addGroup = async (req, res) => {
    const { name, icon } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const insertGroup = `
        INSERT INTO private_groups
          (name, icon, admin_id)
        VALUES (?, ?, ?)
      `;

      const [result] = await db.query(insertGroup, [name, icon, userId]);

      return res.status(201).json({ groupId: result.insertId });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
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
