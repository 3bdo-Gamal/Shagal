const EmployeeModel = require('../models/employeeModel');
const pool = require('../config/db');
const verifyPassword = require("../utils/checkPassword");

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
    const { currentPassword, ...updateData } = req.body; 
    const compId = req.user.comp_id;

    await verifyPassword(pool, "companies", "comp_id", compId, currentPassword);

    const empId = req.params.id;
    const employee = await EmployeeModel.findById(empId);

    if (!employee || employee.comp_id !== compId) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updated = await EmployeeModel.updateEmployee(empId, updateData);
    if (!updated) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    
    res.json({ message: 'Employee updated successfully' });

  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    const compId = req.user.comp_id;

    await verifyPassword(pool, "companies", "comp_id", compId, currentPassword);

    const empId = req.params.id;
    const employee = await EmployeeModel.findById(empId);

    if (!employee || employee.comp_id !== compId) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const deleted = await EmployeeModel.deleteEmployee(empId);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete employee' });
    }

    res.json({ message: 'Employee deleted successfully' });
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

const getEmployeeById = async (req, res, next) => {
  try {
    const compId = req.user.comp_id;   
    const empId = req.params.id;      

    const employee = await EmployeeModel.findById(empId);

   
    if (!employee || employee.comp_id !== compId || employee.isDeleted === 1) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
};


module.exports = { addEmployee, updateEmployee, deleteEmployee, getEmployees, getEmployeeById };
