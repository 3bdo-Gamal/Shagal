const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware.js');
const studentExperienceController = require('../controllers/studentExperienceController');


router.post('/', auth(['student']), studentExperienceController.addExperience);


router.delete('/:id', auth(['student']), studentExperienceController.deleteExperience);

module.exports = router;
