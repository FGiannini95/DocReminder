const db = require("../config/db");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { id: private_groups_id } = req.params;

    try {
      const selectGroup = `
        SELECT 
          name, icon, admin_id, private_groups_id
        FROM private_groups
        WHERE private_groups_id = ?
      `;

      const [resultInfo] = await db.query(selectGroup, [private_groups_id]);
      const group = resultInfo[0];

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      const selectMembers = `
        -- fetch active and pending members
        SELECT 
          group_members.user_id, user.displayName, user.email, group_members.status
        FROM group_members JOIN user ON user.user_id = group_members.user_id
        WHERE group_members.group_id = ?

        UNION

        -- add admin with active status
        SELECT 
          user.user_id, user.displayName, user.email, 'active' AS status
        FROM user
        JOIN private_groups ON private_groups.admin_id = user.user_id
        WHERE private_groups.private_groups_id = ?
      `;

      const [members] = await db.query(selectMembers, [
        private_groups_id,
        private_groups_id,
      ]);

      const selectDependents = `
        SELECT
         group_dependents_id, name, relationship, avatar
        FROM group_dependents 
        WHERE group_id = ?  
      `;

      const [dependents] = await db.query(selectDependents, [
        private_groups_id,
      ]);

      const memberIds = members.map((m) => m.user_id);
      const allUserIds = [...new Set([group.admin_id, ...memberIds])];
      const dependentIds = dependents.map((d) => d.group_dependents_id);

      if (dependentIds.length === 0) {
        const selectDocumentsOnly = `
          SELECT 
            document.document_id AS documentId, 
            document.type, 
            document.name, 
            document.expiry_date AS expiryDate, 
            document.user_id,
            NULL AS dependent_id,
            COALESCE(user.displayName, SUBSTRING_INDEX(user.email, '@', 1)) AS ownerName
          FROM document
          JOIN user ON user.user_id = document.user_id
          WHERE document.user_id IN (?) AND document.is_deleted = 0
        `;

        const [documents] = await db.query(selectDocumentsOnly, [allUserIds]);
        const oneGroup = { group, members, dependents, documents };
        return res.status(200).json(oneGroup);
      }

      const selectDocuments = `
        -- documents belonging to group adults
        SELECT 
          document.document_id AS documentId, 
          document.type, 
          document.name, 
          document.expiry_date AS expiryDate, 
          document.user_id,
          NULL AS dependent_id,
          COALESCE(user.displayName, SUBSTRING_INDEX(user.email, '@', 1)) AS ownerName
        FROM document
        JOIN user ON user.user_id = document.user_id
        WHERE document.user_id IN (?) AND document.is_deleted = 0

        UNION

        -- documents belonging to group dependents
        SELECT 
          document.document_id AS documentId, 
          document.type, 
          document.name, 
          document.expiry_date AS expiryDate, 
          NULL AS user_id,
          document.dependent_id,
          group_dependents.name AS ownerName
        FROM document
        JOIN group_dependents ON group_dependents.group_dependents_id = document.dependent_id
        WHERE document.dependent_id IN (?) AND document.is_deleted = 0
     `;

      const [documents] = await db.query(selectDocuments, [
        allUserIds,
        dependentIds,
      ]);

      const oneGroup = { group, members, dependents, documents };
      return res.status(200).json(oneGroup);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getAllGroup = async (req, res) => {
    const userId = req.user.userId;

    try {
      const selectAllGroups = `
        -- groups where the user is the admin
        SELECT 
          private_groups.private_groups_id, 
          private_groups.name, 
          private_groups.icon,
          (
            SELECT COUNT(*) 
            FROM group_members 
            WHERE group_members.group_id = private_groups.private_groups_id 
            AND group_members.status = 'active'
          ) + 1 AS member_count,
          (
            SELECT COUNT(*) 
            FROM group_dependents 
            WHERE group_dependents.group_id = private_groups.private_groups_id
          ) AS dependent_count
        FROM private_groups
        WHERE private_groups.admin_id = ?

        UNION

        -- groups where the user is an active member
        SELECT 
          private_groups.private_groups_id, 
          private_groups.name, 
          private_groups.icon,
          (
            SELECT COUNT(*) 
            FROM group_members 
            WHERE group_members.group_id = private_groups.private_groups_id 
            AND group_members.status = 'active'
          ) + 1 AS member_count,
          (
            SELECT COUNT(*) 
            FROM group_dependents 
            WHERE group_dependents.group_id = private_groups.private_groups_id
          ) AS dependent_count
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
    const { name, icon } = req.body;
    const { groupId } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    try {
      const editGroup = `
        UPDATE private_groups SET name = ?, icon = ?
        WHERE private_groups_id = ?
      `;

      const [row] = await db.query(editGroup, [name, icon, groupId]);
      if (row.affectedRows === 0) {
        return res.status(404).json({ message: "Group not found" });
      }

      return res.status(200).json({ messsage: "Group update succesfully" });
    } catch (err) {
      res.status(500).json({ message: "Group not found" });
    }
  };

  deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
      // fetch all active members and group name before deleting
      const selectMembersAndGroup = `
        SELECT user.email, private_groups.name AS groupName
        FROM group_members
        JOIN user ON user.user_id = group_members.user_id
        JOIN private_groups ON private_groups.private_groups_id = ?
        WHERE group_members.group_id = ? AND group_members.status = 'active'
      `;

      const [rows] = await db.query(selectMembersAndGroup, [groupId, groupId]);

      const deleteGroup = `
        DELETE FROM private_groups WHERE private_groups_id = ?
      `;

      const [row] = await db.query(deleteGroup, [groupId]);
      if (row.affectedRows === 0) {
        return res.status(404).json({ message: "Group not found" });
      }

      const emails = rows.map((r) => r.email);

      if (emails.length > 0) {
        const msg = {
          to: emails,
          from: process.env.SENDGRID_FROM,
          subject: "DocReminder - Grupo eliminado",
          text: `El administrador ha eliminado el grupo "${rows[0].groupName}".`,
        };
        await resend.emails.send(msg);
      }

      return res.status(200).json({ message: "Group deleted succesfully" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new groupController();
