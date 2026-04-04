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
    const userId = req.user.userId;

    try {
      const selectAllGroups = `
        -- groups where the user is the admin
        SELECT private_groups.private_groups_id, private_groups.name, private_groups.icon
        FROM private_groups
        WHERE private_groups.admin_id = ?
        UNION
        -- groups where the user is an active member
        SELECT private_groups.private_groups_id, private_groups.name, private_groups.icon
        FROM private_groups
        JOIN group_members ON group_members.group_id = private_groups.private_groups_id
        WHERE group_members.user_id = ? AND group_members.status = 'active'
      `;

      const [rows] = await db.query(selectAllGroups, [userId, userId]);
      return res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Group not found" });
    }
  };

  editGroup = async (req, res) => {
    console.log("Hi from editGroup");
  };
  deleteGroup = async (req, res) => {
    console.log("Hi from deleteGroup");
  };
}

module.exports = new groupController();
