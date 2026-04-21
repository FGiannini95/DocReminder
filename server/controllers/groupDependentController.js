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
    const { groupId, group_dependents_id } = req.params;

    try {
      const deleteDependent = `
        DELETE FROM group_dependents WHERE group_dependents_id = ? AND group_id = ?
       `;

      const [rows] = await db.query(deleteDependent, [
        group_dependents_id,
        groupId,
      ]);

      if (rows.affectedRows === 0) {
        return res.status(404).json({ message: "Dependent not found" });
      }

      return res.status(200).json({ message: "Dependent removed succesfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getAllDependents = async (req, res) => {
    const { groupId } = req.params;

    try {
      const selectAllDependents = `
        SELECT group_dependents_id, name, avatar
        FROM group_dependents WHERE group_id = ?
      `;

      const [rows] = await db.query(selectAllDependents, [groupId]);
      return res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new groupDependentController();
