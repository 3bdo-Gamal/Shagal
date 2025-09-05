const Company = require("../models/companyModel");
const bcrypt = require("bcrypt");



exports.updateCompany = async (req, res, next) => {
  try {
    const companyId = req.user.id; 
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }


    if (req.body.currentPassword || req.body.newPassword) {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current and new password are required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, company.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      req.body.password = newPassword;
    }

   
    delete req.body.currentPassword;
    delete req.body.newPassword;

    const success = await Company.update(companyId, req.body);

    if (!success) {
      return res.status(400).json({ message: "No data updated" });
    }

    res.json({ message: "Company updated successfully" });
  } catch (error) {
    console.error("UpdateCompany Error:", error);
    next(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const companyId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return next({ statusCode: 400, message: "Password is required" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return next({ statusCode: 404, message: "Company not found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return next({ statusCode: 401, message: "Invalid password" });
    }

    const success = await Company.delete(companyId);
    if (!success) {
      return next({ statusCode: 500, message: "Failed to delete company" });
    }

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    next(error);
  }
};


exports.getCompanyProfile = async (req, res, next) => {
  try {
    const companyId = req.user.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return next({ statusCode: 404, message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    next(error);
  }
};