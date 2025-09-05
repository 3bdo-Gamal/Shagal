const express = require('express');
const { addEmployee , deleteEmployee } = require('../controllers/employeeController');
const auth = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/', auth(['company']), addEmployee);

router.delete('/:id', auth(['company']), deleteEmployee);

module.exports = router;