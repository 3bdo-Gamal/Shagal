const express = require('express');
const { addEmployee , deleteEmployee , updateEmployee, getEmployees , getEmployeeById } = require('../controllers/employeeController');
const auth = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.get("/", auth(['company']), getEmployees);
router.get("/:id", auth(['company']), getEmployeeById);
router.post('/', auth(['company']), addEmployee);
router.put('/:id', auth(['company']), updateEmployee);
router.delete('/:id', auth(['company']), deleteEmployee);

module.exports = router;