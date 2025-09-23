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
  const { email, password } = req.body;

  try {
    let user = null;
    let role = null;

    
    const [stuRows] = await pool.execute(
      "SELECT stu_id AS id, password FROM student WHERE email = ? LIMIT 1",
      [email]
    );
    if (stuRows.length > 0) {
      user = stuRows[0];
      role = 'student';
    }

    
    if (!user) {
      const [compRows] = await pool.execute(
        "SELECT comp_id AS id, password FROM companies WHERE email = ? LIMIT 1",
        [email]
      );
      if (compRows.length > 0) {
        user = compRows[0];
        role = 'company';
      }
    }

    
    if (!user) {
      const [adminRows] = await pool.execute(
        "SELECT admin_id AS id, ad_role AS role, password FROM admin WHERE email = ? LIMIT 1",
        [email]
      );
      if (adminRows.length > 0) {
        user = adminRows[0];
        role = user.role || 'admin'; 
      }
    }

   
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    
    const tokenPayload = { id: user.id, role };

    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({ message: 'Login successful', token, role });

  } catch (err) {
    next(err);
  }
}
module.exports = { register, login };
