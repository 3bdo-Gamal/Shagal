const db = require('../config/db');
const bcrypt = require('bcrypt');


exports.addStudent = async (studentData) => {
  const hashedPassword = await bcrypt.hash(studentData.password, 12);

  const sql = `
    INSERT INTO student 
      (stu_name, stu_age, stu_address, stu_num, national_id, email, password, linkedin, behance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(sql, [
    studentData.stu_name,
    studentData.stu_age,
    studentData.stu_address,
    studentData.stu_num,
    studentData.national_id,
    studentData.email,
    hashedPassword,
    studentData.linkedin,
    studentData.behance
  ]);

  return result.insertId;
};


exports.getAllStudents = async () => {
  const sql = `SELECT * FROM student`;
  const [rows] = await db.execute(sql);
  return rows;
};


exports.findByEmail = async (email) => {
  const sql = `SELECT * FROM student WHERE email = ? LIMIT 1`;
  const [rows] = await db.execute(sql, [email]);
  return rows[0];
};


exports.findById = async (stu_id) => {
  const sql = `SELECT * FROM student WHERE stu_id = ? LIMIT 1`;
  const [rows] = await db.execute(sql, [stu_id]);
  return rows[0];
};


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
  const [result] = await db.execute(sql, values);

  return result.affectedRows > 0;
};


exports.deleteStudent = async (stu_id) => {
  const sql = `DELETE FROM student WHERE stu_id = ?`;
  const [result] = await db.execute(sql, [stu_id]);
  return result.affectedRows > 0;
};


exports.findAllStudents = async (search = "") => {
  let sql = "SELECT stu_id, stu_name, stu_age, stu_address, stu_num, national_id, email, linkedin, behance FROM student";   
  let params = [];

  if (search) {
    sql += `
      WHERE stu_name LIKE ?
      OR stu_address LIKE ?
      OR stu_num LIKE ?
      OR national_id LIKE ?
      OR email LIKE ?
      OR linkedin LIKE ?
      OR behance LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};