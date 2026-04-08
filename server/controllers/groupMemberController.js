const db = require("../config/db");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class groupMemberController {
  addMember = async (req, res) => {
    console.log("Hi from addMember");
  };

  removeMember = async (req, res) => {
    const { groupId, userId } = req.params;

    try {
      const selectUserAndGroup = `
        SELECT user.email, private_groups.name AS groupName
        FROM user
        JOIN private_groups ON private_groups.private_groups_id = ?
        WHERE user.user_id = ?
      `;

      const [rows] = await db.query(selectUserAndGroup, [groupId, userId]);
      const data = rows[0];

      if (!data) {
        return res.status(404).json({ message: "Member not found" });
      }

      const removeMember = `
        DELETE FROM group_members WHERE group_id = ? AND user_id = ?
      `;

      const [row] = await db.query(removeMember, [groupId, userId]);
      if (row.affectedRows === 0) {
        return res.status(404).json({ message: "Member not found" });
      }

      const msg = {
        to: data.email,
        from: process.env.SENDGRID_FROM,
        subject: "DocReminder - Has sido eliminado del grupo",
        text: `Ya no tienes acceso al grupo "${data.groupName}".`,
      };

      await sgMail.send(msg);

      return res.status(200).json({ message: "User removed succesfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.userId;

    try {
      const leaveGroup = `
        DELETE FROM group_members WHERE group_id = ? and user_id = ?
      `;

      const [row] = await db.query(leaveGroup, [groupId, userId]);
      if (row.affectedRows === 0) {
        return res.status(404).json({ message: "Group not found" });
      }

      return res.status(200).json({ message: "Group withdraw succesfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new groupMemberController();
