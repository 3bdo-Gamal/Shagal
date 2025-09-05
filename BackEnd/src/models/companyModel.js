const pool = require('../config/db');
const bcrypt = require('bcrypt');

const Company = {
  async create(companyData) {
    const hashedPassword = await bcrypt.hash(companyData.password, 12);
    const [result] = await pool.execute(
      `INSERT INTO companies 
        (comp_name, comp_address, comp_type, comp_genre, commercial_register, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        companyData.comp_name,
        companyData.comp_address,
        companyData.comp_type,
        companyData.comp_genre,
        companyData.commercial_register,
        companyData.email,
        hashedPassword
      ]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT * FROM companies WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM companies WHERE comp_id = ? LIMIT 1`,
      [id]
    );
    return rows[0];
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.comp_name) {
      fields.push("comp_name = ?");
      values.push(updateData.comp_name);
    }
    if (updateData.comp_address) {
      fields.push("comp_address = ?");
      values.push(updateData.comp_address);
    }
    if (updateData.comp_type) {
      fields.push("comp_type = ?");
      values.push(updateData.comp_type);
    }
    if (updateData.comp_genre) {
      fields.push("comp_genre = ?");
      values.push(updateData.comp_genre);
    }
    if (updateData.commercial_register) {
      fields.push("commercial_register = ?");
      values.push(updateData.commercial_register);
    }
    if (updateData.email) {
      fields.push("email = ?");
      values.push(updateData.email);
    }
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 12);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE companies SET ${fields.join(", ")} WHERE comp_id = ?`,
      values
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM companies WHERE comp_id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  async findAll(search = "") {
    let sql = "SELECT * FROM companies";
    let params = [];

    if (search) {
      sql += " WHERE comp_name LIKE ?"; 
      params.push(`%${search}%`);
    }

    const [rows] = await pool.execute(sql, params);
    return rows;
  }
};

module.exports = Company;
