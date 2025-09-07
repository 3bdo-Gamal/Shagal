const bcrypt = require("bcrypt");

/*
 * @param {object} db - mysql2 pool/connection
 * @param {string} table - Table name ("companies" or "student")
 * @param {string} idField - Primary key field ("comp_id" or "stu_id")
 * @param {number} id - User id
 * @param {string} password - Password from request
 * @returns {Promise<void>} Throws error if not valid
 */


async function verifyPassword(db, table, idField, id, password) {
  if (!password) {
    throw { status: 400, message: "Password is required" };
  }

  const [rows] = await db.execute(
    `SELECT password FROM ${table} WHERE ${idField} = ? AND is_deleted = 0`,
    [id]
  );

  if (rows.length === 0) {
    throw { status: 404, message: "User not found" };
  }

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) {
    throw { status: 401, message: "Invalid password" };
  }
}

module.exports = verifyPassword;
