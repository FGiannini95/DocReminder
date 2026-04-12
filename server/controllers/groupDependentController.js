const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupDependentController {
  addDependent = async (req, res) => {
    const { groupId } = req.params;
    const { name, relationship, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing mandatory field" });
    }

    try {
      const insertDependent = `
        INSERT INTO group_dependents (group_id, name, relationship, avatar) VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.query(insertDependent, [
        groupId,
        name,
        relationship,
        avatar,
      ]);

      return res.status(201).json({ dependentId: result.insertId });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  removeDependent = async (req, res) => {
    // extract groupId and group_dependents_id from req.params

    try {
      // DELETE FROM group_dependents WHERE group_dependents_id = ? AND group_id = ?
      // (CASCADE handles documents automatically)
      // if no rows affected return 404
      // return 200
    } catch (err) {
      // return 500
    }
  };
}

module.exports = new groupDependentController();
