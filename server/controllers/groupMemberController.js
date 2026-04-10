const db = require("../config/db");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class groupMemberController {
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

  inviteMember = async (req, res) => {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing email" });
    }

    try {
      const selectGroup = `
        SELECT name FROM private_groups WHERE private_groups_id = ?
      `;
      const [rows] = await db.query(selectGroup, [groupId]);
      const group = rows[0];
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      const checkExisting = `
        SELECT group_members.group_members_id 
        FROM group_members 
        JOIN user ON user.user_id = group_members.user_id
        WHERE group_members.group_id = ? AND user.email = ?
      `;

      const [existing] = await db.query(checkExisting, [groupId, email]);
      if (existing.length > 0) {
        return res
          .status(400)
          .json({ message: "This user already belong to the group" });
      }

      const selectUser = `
        SELECT user_id, email FROM user WHERE email = ?
      `;

      const [row] = await db.query(selectUser, [email]);
      const existingUser = row[0];

      let userId;
      if (existingUser) {
        userId = existingUser.user_id;
      } else {
        const insertUser = `INSERT INTO user (email) VALUES (?)`;
        const [result] = await db.query(insertUser, [email]);
        userId = result.insertId;
      }
      // Generate invite token JWT 48h
      const inviteToken = jwt.sign(
        { groupId, email, purpose: "invite" },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "48h" },
      );

      const inviteExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const insertInvitation = `
        INSERT INTO group_members (group_id, user_id, status, invite_token, invite_expires_at) 
        VALUES (?, ?, 'pending', ?, ?)
      `;

      await db.query(insertInvitation, [
        groupId,
        userId,
        inviteToken,
        inviteExpires,
      ]);

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: "DocReminder - Invitación pendiente a un grupo",
        text: `Has sido invitado al grupo "${group.name}". Haz clic aquí para unirte: ${process.env.FRONTEND_URL}/invite/${inviteToken}`,
      };

      await sgMail.send(msg);

      return res.status(200).json({ message: "Invite sent succesfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  acceptInvite = async (req, res) => {
    const { token } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (decoded.purpose !== "invite") {
        return res.status(400).json({ message: "Invalid token" });
      }

      const acceptInvitation = `
        UPDATE group_members SET status = ?, joined_at = ?
        WHERE invite_token = ? AND status = "pending"
      `;

      const [result] = await db.query(acceptInvitation, [
        "active",
        new Date(),
        token,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Group member not found" });
      }

      return res.status(200).json({ groupId: decoded.groupId });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new groupMemberController();
