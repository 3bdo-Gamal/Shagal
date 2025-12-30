const db = require('../config/db');


exports.createMatch = async (job_id, stu_id, admin_id) => {
  const sql = `
    INSERT INTO job_match (job_id, stu_id, admin_id, is_deleted)
    VALUES (?, ?, ?, 0)
  `;
  const [result] = await db.execute(sql, [job_id, stu_id, admin_id]);
  return result;
};


exports.getMatches = async () => {
  const sql = `
    SELECT 
      jm.job_match_id,
      s.stu_name,
      s.email AS stu_email,
      c.comp_name,
      c.email AS comp_email,
      j.job_title,
      a.ad_name
    FROM job_match jm
    JOIN student s ON jm.stu_id = s.stu_id
    JOIN comp_jobs j ON jm.job_id = j.job_id
    JOIN companies c ON j.comp_id = c.comp_id
    JOIN admin a ON jm.admin_id = a.admin_id
    WHERE jm.is_deleted = 0
  `;
  const [rows] = await db.execute(sql);
  return rows;
};

exports.updateMatch = async (job_match_id, job_id, stu_id, admin_id) => {
  const sql = `
    UPDATE job_match
    SET job_id = ?, stu_id = ?, admin_id = ?
    WHERE job_match_id = ? AND is_deleted = 0
  `;
  const [result] = await db.execute(sql, [job_id, stu_id, admin_id, job_match_id]);
  return result;
};


exports.deleteMatch = async (job_match_id) => {
  const sql = `
    UPDATE job_match 
    SET is_deleted = 1 
    WHERE job_match_id = ?
  `;
  const [result] = await db.execute(sql, [job_match_id]);
  return result;
};
