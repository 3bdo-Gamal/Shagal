const db = require('../config/db');

exports.addExperience = async (experienceData) => {
  const sql = `
    INSERT INTO stu_experience (job_title, comp_name, startedAt, endedAt, stu_id, is_deleted)
    VALUES (?, ?, ?, ?, ?, 0)
  `;
  const [result] = await db.execute(sql, [
    experienceData.job_title,
    experienceData.comp_name,
    experienceData.startedAt,
    experienceData.endedAt || null,
    experienceData.stu_id
  ]);
  return result.insertId;
};

exports.getExperiencesByStudent = async (stu_id) => {
  const sql = `SELECT * FROM stu_experience WHERE stu_id = ? AND is_deleted = 0`;
  const [rows] = await db.execute(sql, [stu_id]);
  return rows;
};

exports.findByIdAndStudent = async (exp_id, stu_id) => {
  const sql = `SELECT * FROM stu_experience WHERE exp_id = ? AND stu_id = ? AND is_deleted = 0 LIMIT 1`;
  const [rows] = await db.execute(sql, [exp_id, stu_id]);
  return rows[0];
};

exports.deleteExperience = async (exp_id, stu_id) => {
  const sql = `UPDATE stu_experience SET is_deleted = 1 WHERE exp_id = ? AND stu_id = ?`;
  const [result] = await db.execute(sql, [exp_id, stu_id]);
  return result.affectedRows > 0;
};

exports.updateExperience = async (exp_id, stu_id, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.job_title) {
    fields.push("job_title = ?");
    values.push(updateData.job_title);
  }
  if (updateData.comp_name) {
    fields.push("comp_name = ?");
    values.push(updateData.comp_name);
  }
  if (updateData.startedAt) {
    fields.push("startedAt = ?");
    values.push(updateData.startedAt);
  }
  if (updateData.endedAt) {
    fields.push("endedAt = ?");
    values.push(updateData.endedAt);
  }

  if (fields.length === 0) return false;

  values.push(exp_id, stu_id);

  const sql = `UPDATE stu_experience SET ${fields.join(", ")} WHERE exp_id = ? AND stu_id = ? AND is_deleted = 0`;
  const [result] = await db.execute(sql, values);

  return result.affectedRows > 0;
};
