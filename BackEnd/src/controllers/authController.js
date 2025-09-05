const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res, next) {
  const { type, name, age, address, num, national_id, email, password, linkedin, behance, comp_type, comp_genre, commercial_register } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    if (type === 'student') {
      const [result] = await pool.execute(
        `INSERT INTO student (stu_name, stu_age, stu_address, stu_num, national_id, email, password, linkedin, behance)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, age, address, num, national_id, email, hashedPassword, linkedin, behance]
      );
      return res.status(201).json({ message: 'Student registered successfully', id: result.insertId });
    }

    if (type === 'company') {
      const [result] = await pool.execute(
        `INSERT INTO companies (comp_name, comp_address, comp_type, comp_genre, commercial_register, email, password)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, comp_type, comp_genre, commercial_register, email, hashedPassword]
      );
      return res.status(201).json({ message: 'Company registered successfully', id: result.insertId });
    }

    return res.status(400).json({ error: 'Invalid type' });

  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password, type } = req.body;

  try {
    let table, idField, role;

    if (type === 'student') {
      table = 'student';
      idField = 'stu_id';
      role = 'student';
    } else if (type === 'company') {
      table = 'companies';
      idField = 'comp_id';
      role = 'company';
    } else if (type === 'admin') {
      table = 'admin'; 
      idField = 'admin_id';
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM ${table} WHERE email = ? LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }


    let tokenPayload;
    
if (type === 'admin') {
  tokenPayload = { id: user[idField], role: user.ad_role };
} else if (type === 'company') {
  tokenPayload = { comp_id: user.comp_id, role: 'company' };
} else {
  tokenPayload = { stu_id: user.stu_id, role: 'student' };
}

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token, role: tokenPayload.role });

  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
