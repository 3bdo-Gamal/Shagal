const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/company", authMiddleware(['company']), userController.getCompanyProfile);
router.put("/company", authMiddleware(['company']), userController.updateCompany);
router.delete("/company", authMiddleware(['company']), userController.deleteCompany);

router.get("/student", authMiddleware(['student']), userController.getStudentProfile);
router.put("/student", authMiddleware(['student']), userController.updateStudent);
router.delete("/student", authMiddleware(['student']), userController.deleteStudent);

module.exports = router;