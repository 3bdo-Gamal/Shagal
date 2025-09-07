const experienceModel = require('../models/studentExperienceModel');


exports.addExperience = async (req, res, next) => {
  const { job_title, comp_name, startedAt, endedAt } = req.body;
  const stu_id = req.user.stu_id;

  if (!job_title || !comp_name || !startedAt || !endedAt) {
    return res.status(400).json({ error: 'job_title, comp_name, startedAt and endedAt are required' });
  }

  try {
    const exp_id = await experienceModel.addExperience({
      job_title,
      comp_name,
      startedAt,
      endedAt,
      stu_id
    });

    res.status(201).json({
      message: 'Experience added successfully',
      exp_id
    });
  } catch (err) {
    next(err);
  }
};


exports.getExperiences = async (req, res, next) => {
  try {
    const stu_id = req.user.stu_id;
    const experiences = await experienceModel.getExperiencesByStudent(stu_id);
    res.json(experiences);
  } catch (err) {
    next(err);
  }
};


exports.updateExperience = async (req, res, next) => {
  try {
    const exp_id = req.params.id;
    const stu_id = req.user.stu_id;
    const updateData = req.body;

    const experience = await experienceModel.findByIdAndStudent(exp_id, stu_id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found or not yours' });
    }

    const updated = await experienceModel.updateExperience(exp_id, stu_id, updateData);
    if (!updated) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    res.json({ message: 'Experience updated successfully' });
  } catch (err) {
    next(err);
  }
};


exports.deleteExperience = async (req, res, next) => {
  try {
    const exp_id = req.params.id;
    const stu_id = req.user.stu_id;

    const experience = await experienceModel.findByIdAndStudent(exp_id, stu_id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found or not yours' });
    }

    await experienceModel.deleteExperience(exp_id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    next(err);
  }
};
