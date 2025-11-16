const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware.js');
const studentExperienceController = require('../controllers/studentExperienceController');


router.post('/', auth(['student']), studentExperienceController.addExperience);
router.get('/', auth(['student']), studentExperienceController.getExperiences);
router.get('/:id', auth(['student']), studentExperienceController.getExperienceById);
router.put('/:id', auth(['student']), studentExperienceController.updateExperience);
router.delete('/:id', auth(['student']), studentExperienceController.deleteExperience);

module.exports = router;
