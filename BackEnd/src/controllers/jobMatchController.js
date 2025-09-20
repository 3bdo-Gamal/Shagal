const JobMatch = require('../models/jobMatchModel');


exports.createMatch = async (req, res) => {
  try {
    const { job_id, stu_id } = req.body;
    const admin_id = req.user.admin_id; // comes from authMiddleware

    const result = await JobMatch.createMatch(job_id, stu_id, admin_id);
    res.status(201).json({ message: 'Match created successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMatches = async (req, res) => {
  try {
    const matches = await JobMatch.getMatches();
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateMatch = async (req, res) => {
  try {
    const { job_match_id, job_id, stu_id } = req.body;
    const admin_id = req.user.admin_id;

    const result = await JobMatch.updateMatch(job_match_id, job_id, stu_id, admin_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Match not found or already deleted' });
    }

    res.json({ message: 'Match updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteMatch = async (req, res) => {
  try {
    const { job_match_id } = req.params;

    const result = await JobMatch.deleteMatch(job_match_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
