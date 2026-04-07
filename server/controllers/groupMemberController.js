const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupMemberController {
  addMember = async (req, res) => {
    console.log("Hi from addMember");
  };

  removeMember = async (req, res) => {
    const { groupId, userId } = req.params;

    try {
      const removeMember = `
        DELETE FROM group_members WHERE group_id = ? AND user_id = ?
      `;

      const [row] = await db.query(removeMember, [groupId, userId]);
      if (row.affectedRows === 0) {
        return res.status(404).json({ message: "Member not found" });
      }

      return res.status(200).json({ message: "User removed succesfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new groupMemberController();
