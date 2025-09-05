const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middlewares/authMiddleware.js');

router.post('/', auth(['company']), jobController.createJob);

router.get('/', jobController.getJobs);

router.delete('/:id', auth(['company']), jobController.deleteJob);

module.exports = router;