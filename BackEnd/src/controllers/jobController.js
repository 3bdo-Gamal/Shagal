const Job = require('../models/jobModel');

exports.createJob = async (req, res, next) => {
  try {
    const { job_title, job_type, numberNeeded } = req.body;

    if (!job_title || !job_type || !numberNeeded) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const compId = req.user.comp_id;

    const jobId = await Job.create(job_title, job_type, numberNeeded, compId);

    res.status(201).json({
      message: 'Job created successfully',
      jobId
    });
  } catch (err) {
    next(err);
  }
};




exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

  exports.updateJob = async (req, res, next) => {
    try {
      const jobId = req.params.id;
      const compId = req.user.comp_id; 
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      if (job.comp_id !== compId) {
        return res.status(403).json({ error: 'Not authorized to update this job' });
      }

      const updated = await Job.updateJob(jobId, updateData);
      if (!updated) {
        return res.status(400).json({ error: 'No fields were updated' });
      }

     res.json({
  message: 'Job updated successfully',
  job: await Job.findById(jobId)
});
    } catch (err) {
      next(err);
    }
  };

exports.deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const compId = req.user.comp_id; 


    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.comp_id !== compId) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await Job.delete(jobId);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
};

