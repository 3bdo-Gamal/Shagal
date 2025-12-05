const express = require("express");
const router = express.Router();

const userAdminController = require("../controllers/adminController");
const jobMatchController = require('../controllers/jobMatchController');
const auth = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");


// Companies CRUD
router.post("/comp", auth(["comp"]), userAdminController.addCompany);
router.get("/comp", auth(["comp"]), userAdminController.getAllCompanies);
router.get("/comp/:id", auth(["comp"]), userAdminController.getCompanyById);
router.put("/comp/:id", auth(["comp"]), userAdminController.updateCompany);
router.delete("/comp/:id", auth(["comp"]), userAdminController.deleteCompany);
router.get("/compjobs/:id", auth(["comp"]), adminController.getJobsByCompany);

// Students CRUD
router.post("/stu", auth(["stu"]), userAdminController.addStudent);
router.get("/stu", auth(["stu"]), userAdminController.getAllStudents);
router.get("/stu/:id", auth(["stu"]), userAdminController.getStudentById);
router.put("/stu/:id", auth(["stu"]), userAdminController.updateStudent);
router.delete("/stu/:id", auth(["stu"]), userAdminController.deleteStudent);
router.get("/stuexp/:id", auth(["stu"]), adminController.getexpbyStudentId);

// Job Matches CRUD
router.post("/job-match", auth(["admin" ,"high"]), jobMatchController.createMatch);
router.get("/job-match", auth("admin" ,["high"]), jobMatchController.getMatches);
router.put("/job-match", auth("admin" ,["high"]), jobMatchController.updateMatch);
router.delete("/job-match/:job_match_id", auth("admin" ,["high"]), jobMatchController.deleteMatch);





module.exports = router;