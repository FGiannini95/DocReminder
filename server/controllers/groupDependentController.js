const db = require("../config/db");
const jwt = require("jsonwebtoken");

class groupDependentController {
  addDependent = async (req, res) => {
    // extract groupId from req.params
    // extract name, relationship, birth_date, avatar from req.body

    // if name missing return 400

    try {
      // INSERT INTO group_dependents (group_id, name, relationship, birth_date, avatar)
      // return 201 with new dependent id
    } catch (err) {
      // return 500
    }
  };
}

module.exports = new groupDependentController();
