const db = require('../config/db');
const bcrypt = require('bcrypt');

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
  const sql = `UPDATE student SET is_deleted = 1 WHERE stu_id = ?`;
  const [result] = await db.execute(sql, [stu_id]);
  return result.affectedRows > 0;
};


