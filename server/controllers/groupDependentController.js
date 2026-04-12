const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupDependentController {
  addDependent = async (req, res) => {
    const { groupId } = req.params;
    const { name, relationship, birth_date, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing mandatory field" });
    }

    try {
      const insertDependent = `
        INSERT INTO group_dependents (group_id, name, relationship, birth_date, avatar) VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(insertDependent, [
        groupId,
        name,
        relationship,
        birth_date,
        avatar,
      ]);

      return res.status(201).json({ dependentId: result.insertId });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new groupDependentController();
