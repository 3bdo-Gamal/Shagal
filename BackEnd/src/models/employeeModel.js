const db = require('../config/db');


exports.addEmployee = async (employeeData) => {
  const sql = `
    INSERT INTO comp_employee (emp_name, emp_role, emp_number, comp_id)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.execute(sql, [
    employeeData.emp_name,
    employeeData.emp_role,
    employeeData.emp_number,
    employeeData.comp_id
  ]);
  return result.insertId;
};


exports.getEmployeesByCompany = async (comp_id) => {
  const sql = `SELECT * FROM comp_employee WHERE comp_id = ?`;
  const [rows] = await db.execute(sql, [comp_id]);
  return rows;
};


exports.updateEmployee = async (emp_id, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.emp_name) {
    fields.push("emp_name = ?");
    values.push(updateData.emp_name);
  }
  if (updateData.emp_role) {
    fields.push("emp_role = ?");
    values.push(updateData.emp_role);
  }
  if (updateData.emp_number) {
    fields.push("emp_number = ?");
    values.push(updateData.emp_number);
  }

  if (fields.length === 0) return false;

  values.push(emp_id);

  const sql = `UPDATE comp_employee SET ${fields.join(", ")} WHERE emp_id = ?`;
  const [result] = await db.execute(sql, values);

  return result.affectedRows > 0;
};


exports.findById = async (emp_id) => {
  const sql = `SELECT * FROM comp_employee WHERE emp_id = ? LIMIT 1`;
  const [rows] = await db.execute(sql, [emp_id]);
  return rows[0];
};


exports.deleteEmployee = async (emp_id) => {
  const sql = `UPDATE comp_employee SET is_deleted = 1 WHERE emp_id = ?`;
  const [result] = await db.execute(sql, [emp_id]);
  return result.affectedRows > 0;
};