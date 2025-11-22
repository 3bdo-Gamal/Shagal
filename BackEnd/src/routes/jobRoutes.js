const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middlewares/authMiddleware.js');
const { ro } = require('@faker-js/faker');

router.post('/', auth(['company']), jobController.createJob);

router.get('/all', jobController.getJobs);

router.get('/comp', auth(['company']), jobController.getJobsBycompany);

router.delete('/:id', auth(['company']), jobController.deleteJob);

router.put('/:id', auth(['company']), jobController.updateJob);

router.get('/:id', jobController.getJobById);


module.exports = router;