const db = require('../config/db');


exports.addJob = async (jobData) => {
  const sql = `
    INSERT INTO comp_jobs (job_title, job_type, numberNeeded, comp_id)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.execute(sql, [
    jobData.job_title,
    jobData.job_type,
    jobData.numberNeeded,
    jobData.comp_id
  ]);
  return result.insertId;
};


exports.findAll = async (search = "") => {
  let sql = "SELECT * FROM comp_jobs";   
  let params = [];

  if (search) {
    sql += " WHERE job_title LIKE ?";    
    params.push(`%${search}%`);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};


exports.getJobsByCompany = async (comp_id) => {
  const sql = `SELECT * FROM comp_jobs WHERE comp_id = ?`;
  const [rows] = await db.execute(sql, [comp_id]);
  return rows;
};


exports.findById = async (job_id) => {
  const sql = `SELECT * FROM comp_jobs WHERE job_id = ? LIMIT 1`;
  const [rows] = await db.execute(sql, [job_id]);
  return rows[0];
};


exports.updateJob = async (job_id, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.job_title) {
    fields.push("job_title = ?");
    values.push(updateData.job_title);
  }
  if (updateData.job_type) {
    fields.push("job_type = ?");
    values.push(updateData.job_type);
  }
  if (updateData.numberNeeded) {
    fields.push("numberNeeded = ?");
    values.push(updateData.numberNeeded);
  }

  if (fields.length === 0) return false;

  values.push(job_id);

  const sql = `UPDATE comp_jobs SET ${fields.join(", ")} WHERE job_id = ?`;
  const [result] = await db.execute(sql, values);

  return result.affectedRows > 0;
};


exports.deleteJob = async (job_id) => {
  const sql = `UPDATE comp_jobs SET is_deleted = 1 WHERE job_id = ?`;
  const [result] = await db.execute(sql, [job_id]);
  return result.affectedRows > 0;
};