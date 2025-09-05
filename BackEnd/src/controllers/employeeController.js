const EmployeeModel = require('../models/employeeModel');
const db = require('../config/db');
const bcrypt = require('bcrypt');


const verifyCompanyPassword = async (compId, password) => {
  const [rows] = await db.execute(`SELECT comp_password FROM companies WHERE comp_id = ?`, [compId]);
  if (rows.length === 0) return false;
  return bcrypt.compare(password, rows[0].comp_password);
};


const addEmployee = async (req, res, next) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ error: 'Only companies can add employees' });
    }

    const { emp_name, emp_role, emp_number } = req.body;
    if (!emp_name || !emp_role || !emp_number) {
      return res.status(400).json({ error: 'All fields are required (name, role, number)' });
    }

    const comp_id = req.user.comp_id;
    const employeeId = await EmployeeModel.addEmployee({ emp_name, emp_role, emp_number, comp_id });

    res.status(201).json({
      message: 'Employee added successfully',
      employeeId
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const empId = req.params.id;
    const compId = req.user.comp_id;
    const { companyPassword, ...updateData } = req.body;

    if (!companyPassword) {
      return res.status(400).json({ error: 'Company password is required for update' });
    }

    const valid = await verifyCompanyPassword(compId, companyPassword);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid company password' });
    }

    const employee = await EmployeeModel.findById(empId);
    if (!employee || employee.comp_id !== compId) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updated = await EmployeeModel.updateEmployee(empId, updateData);
    if (!updated) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const fresh = await EmployeeModel.findById(empId);
    res.json({ message: 'Employee updated successfully', employee: fresh });
  } catch (error) {
    next(error);
  }
};


const deleteEmployee = async (req, res, next) => {
  try {
    const empId = req.params.id;
    const compId = req.user.comp_id;
    const { companyPassword } = req.body;

    if (!companyPassword) {
      return res.status(400).json({ error: 'Company password is required for delete' });
    }

    const valid = await verifyCompanyPassword(compId, companyPassword);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid company password' });
    }

    const employee = await EmployeeModel.findById(empId);
    if (!employee || employee.comp_id !== compId) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const deleted = await EmployeeModel.deleteEmployee(empId);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete employee' });
    }

    res.json({ message: 'Employee deleted successfully', employeeId: empId });
  } catch (error) {
    next(error);
  }
};


const getEmployees = async (req, res, next) => {
  try {
    const compId = req.user.comp_id;
    const employees = await EmployeeModel.getEmployeesByCompany(compId);
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

module.exports = { addEmployee, updateEmployee, deleteEmployee, getEmployees };
