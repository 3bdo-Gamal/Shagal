const userModel = require("../models/userModel"); 
const pool = require("../config/db");
const verifyPassword = require("../utils/checkPassword");
const authMiddleware = require("../middlewares/authMiddleware");

//Company

exports.getCompanyProfile = async (req, res, next) => {
  try {
    
    const company = await userModel.findCompById(req.user.comp_id); 
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    
    const { currentPassword } = req.body;
    const id = req.user.comp_id;
    await verifyPassword(pool, "companies", "comp_id", id, currentPassword);

    
    const success = await userModel.updateComp(id, req.body);
    if (!success) {
      return res.status(400).json({ error: "Company update failed or no changes" });
    }

    res.json({ message: "Company updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    
    const { currentPassword } = req.body;
    const id = req.user.comp_id;
    await verifyPassword(pool, "companies", "comp_id", id, currentPassword);

    const success = await userModel.deleteComp(id);
    if (!success) {
      return res.status(400).json({ error: "Company delete failed" });
    }

    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//Student
exports.getStudentProfile = async (req, res, next) => {
  
  try {
    console.log('🚀 getStudentProfile started');
    const student = await userModel.findStuById(req.user.stu_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    
    const { currentPassword } = req.body;
    const id = req.user.stu_id;
    await verifyPassword(pool, "student", "stu_id", id, currentPassword);

    const success = await userModel.updateStudent(id, req.body);
    if (!success) {
      return res.status(400).json({ error: "Student update failed or no changes" });
    }

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    
    const { currentPassword } = req.body;
    const id = req.user.stu_id;
    await verifyPassword(pool, "student", "stu_id", id, currentPassword);

    const success = await userModel.deleteStudent(id);
    if (!success) {
      return res.status(400).json({ error: "Student delete failed" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};
