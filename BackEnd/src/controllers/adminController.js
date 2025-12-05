const userModel = require("../models/userModel");
const Job = require('../models/jobModel');
const stuexp = require('../models/studentExperienceModel');

// Comp Admin
exports.addCompany = async (req, res, next) => {
  try {
    const id = await userModel.addCompany(req.body);
    res.status(201).json({ message: "Company created successfully", id });
  } catch (err) {
    next(err);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await userModel.findCompById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
};

exports.getJobsByCompany = async (req, res, next) => {   //here we are sending company id by params not body
  try {
    const jobs = await Job.getJobsByCompany(req.params.id);
    if(!jobs) return res.status(404).json({ error: "No jobs found for this company" });
    res.json(jobs);
  } catch (err) {
    next(err);
  } 
};


exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await userModel.getAllCompanies();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const updated = await userModel.updateComp(req.params.id, req.body);
    if (!updated) return res.status(400).json({ error: "No fields to update" });
    res.json({ message: "Company updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const deleted = await userModel.deleteComp(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// Student Admin
exports.addStudent = async (req, res, next) => {
  try {
    const id = await userModel.addStudent(req.body);
    res.status(201).json({ message: "Student created successfully", id });
  } catch (err) {
    next(err);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const student = await userModel.findStuById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await userModel.getAllStudents();
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const updated = await userModel.updateStudent(req.params.id, req.body);
    if (!updated) return res.status(400).json({ error: "No fields to update" });
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    next(err);
  }
};


exports.deleteStudent = async (req, res, next) => {
  try {
    const deleted = await userModel.deleteStudent(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getexpbyStudentId = async (req, res, next) => {
  try {
    const experiences = await stuexp.getExperiencesByStudent(req.params.id);
    if (!experiences) return res.status(404).json({ error: "No experiences found for this student" });
    res.json(experiences);
  } catch (err) {
    next(err);
  } 
};