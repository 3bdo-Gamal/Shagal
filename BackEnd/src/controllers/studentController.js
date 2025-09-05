const studentModel = require('../models/studentModel');
const bcrypt = require('bcrypt');

exports.getStudentById = async (req, res, next) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const stu_id = req.params.id;
    const { currentPassword, newPassword, ...updateData } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required' });
    }

    const student = await studentModel.findById(stu_id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    
    if (newPassword) {
      updateData.password = newPassword;
    }

    const updated = await studentModel.updateStudent(stu_id, updateData);
    if (!updated) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    next(err);
  }
};


exports.deleteStudent = async (req, res, next) => {
  try {
    const stu_id = req.params.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const student = await studentModel.findById(stu_id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const deleted = await studentModel.deleteStudent(stu_id);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete student' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};