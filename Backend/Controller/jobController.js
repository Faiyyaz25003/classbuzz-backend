import Job from "../Models/jobModel.js";


// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE JOB
export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};