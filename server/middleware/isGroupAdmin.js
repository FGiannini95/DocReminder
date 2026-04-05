const db = require("../config/db");

const isGroupAdmin = async (req, res, next) => {
  const { id: group_id } = req.params;
  const userId = req.user.userId;

  try {
    const checkAdmin = `
      SELECT private_groups_id FROM private_groups 
      WHERE private_groups_id = ? AND admin_id = ?
    `;
    const [admin] = await db.query(checkAdmin, [group_id, userId]);
    if (admin.length === 0)
      return res.status(403).json({ message: "Access denied" });

    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { isGroupAdmin };
