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
         group_dependents_id, name, relationship, birth_date
        FROM group_dependents 
        WHERE group_id = ?  
      `;

      const [dependants] = await db.query(selectDependents, [
        private_groups_id,
      ]);

      const memberIds = members.map((m) => m.user_id);
      const allUserIds = [...new Set([group.admin_id, ...memberIds])];
      const dependentIds = dependants.map((d) => d.group_dependents_id);

      if (dependentIds.length === 0) {
        const oneGroup = { group, members, dependants, documents: [] };
        return res.status(200).json(oneGroup);
      }

      const selectDocuments = `
        SELECT 
          document_id AS documentId, type, name, expiry_date AS expiryDate, user_id, NULL AS dependent_id
        FROM document
        WHERE user_id IN (?) AND is_deleted = 0

        UNION

        SELECT 
          document_id AS documentId, type, name, expiry_date AS expiryDate, NULL AS user_id, dependent_id
        FROM document
        WHERE dependent_id IN (?) AND is_deleted = 0
     `;

      const [documents] = await db.query(selectDocuments, [
        allUserIds,
        dependentIds,
      ]);

      const oneGroup = { group, members, dependants, documents };
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
          ) + 1 AS member_count
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
          ) + 1 AS member_count
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
