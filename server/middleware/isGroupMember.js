const db = require("../config/db");

const isGroupMember = async (req, res, next) => {
  const { id, groupId } = req.params;
  const group_id = id ?? groupId;
  const userId = req.user.userId;

  try {
    const checkAdmin = `
      SELECT private_groups_id FROM private_groups 
      WHERE private_groups_id = ? AND admin_id = ?
    `;
    const [admin] = await db.query(checkAdmin, [group_id, userId]);
    if (admin.length > 0) return next();

    const checkMember = `
      SELECT group_members_id FROM group_members 
      WHERE group_id = ? AND user_id = ? AND status = 'active'
    `;

    const [member] = await db.query(checkMember, [group_id, userId]);
    if (member.length === 0)
      return res.status(403).json({ message: "Access denied" });

    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { isGroupMember };
