const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Company model to edit the user from the end user 
exports.updateComp = async (id, updateData) => {
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
    `UPDATE companies SET ${fields.join(", ")} WHERE comp_id = ? AND is_deleted = 0`,
    values
  );
  return result.affectedRows > 0;
};

exports.deleteComp = async (comp_id) => {
  const [result] = await pool.execute(
    `UPDATE companies SET is_deleted = 1 WHERE comp_id = ?`,
    [comp_id]
  );
  return result.affectedRows > 0;
};

exports.findCompById = async (comp_id) => {
  const [rows] = await pool.execute(
    `SELECT comp_id, comp_name, comp_address, comp_type, comp_genre,
            commercial_register, email
     FROM companies 
     WHERE comp_id = ? AND is_deleted = 0`,
    [comp_id]
  );
  return rows[0] || null;
};


// Student  model to edit the user from the end user 
exports.updateStudent = async (stu_id, updateData) => {
  const fields = [];
  const values = [];
  if (updateData.stu_name) {
    fields.push("stu_name = ?");
    values.push(updateData.stu_name);
  }
  if (updateData.stu_age) {
    fields.push("stu_age = ?");
    values.push(updateData.stu_age);
  }
  if (updateData.stu_address) {
    fields.push("stu_address = ?");
    values.push(updateData.stu_address);
  }
  if (updateData.stu_num) {
    fields.push("stu_num = ?");
    values.push(updateData.stu_num);
  }
  if (updateData.national_id) {
    fields.push("national_id = ?");
    values.push(updateData.national_id);
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
  if (updateData.linkedin) {
    fields.push("linkedin = ?");
    values.push(updateData.linkedin);
  }
  if (updateData.behance) {
    fields.push("behance = ?");
    values.push(updateData.behance);
  }
  if (fields.length === 0) return false;
  values.push(stu_id);
  const sql = `UPDATE student SET ${fields.join(", ")} WHERE stu_id = ?`;
  const [result] = await pool.execute(sql, values);
  return result.affectedRows > 0;
};


exports.deleteStudent = async (stu_id) => {
  const sql = `UPDATE student SET is_deleted = 1 WHERE stu_id = ?`;
  const [result] = await pool.execute(sql, [stu_id]);
  return result.affectedRows > 0;
};



exports.findStuById = async (stu_id) => {
  const [rows] = await pool.execute(
    `SELECT stu_id, stu_name, stu_age, stu_address, stu_num, national_id, 
     email, linkedin, behance
     FROM student WHERE stu_id = ? AND is_deleted = 0`,
    [stu_id]
  );
  return rows[0] || null;
};