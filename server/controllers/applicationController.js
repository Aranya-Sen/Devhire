const pool = require('../config/db');

// POST /api/applications/:jobId — candidate only
const applyToJob = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;
    const { jobId } = req.params;
    const { resume_url } = req.body;

    // Check job exists and is open
    const job = await pool.query(
      'SELECT id, last_date, status, min_cgpa FROM jobs WHERE id = $1',
      [jobId]
    );
    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.rows[0].status === 'closed') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }
    if (new Date(job.rows[0].last_date) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Check already applied
    const alreadyApplied = await pool.query(
      'SELECT id FROM applications WHERE job_id = $1 AND candidate_id = $2',
      [jobId, candidate_id]
    );
    if (alreadyApplied.rows.length > 0) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Get candidate resume and cgpa in one query
    const candidate = await pool.query(
      'SELECT cgpa, resume_url FROM candidates WHERE id = $1',
      [candidate_id]
    );

    // Check CGPA requirement
    if (parseFloat(candidate.rows[0].cgpa) < parseFloat(job.rows[0].min_cgpa)) {
      return res.status(400).json({
        message: `Your CGPA (${candidate.rows[0].cgpa}) does not meet the minimum requirement of ${job.rows[0].min_cgpa}`
      });
    }

    // Use provided resume or fall back to candidate's stored resume
    const finalResumeUrl = resume_url || candidate.rows[0].resume_url;

    if (!finalResumeUrl) {
      return res.status(400).json({ message: 'No resume found. Please upload a resume before applying' });
    }

    const result = await pool.query(
      `INSERT INTO applications (job_id, candidate_id, resume_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [jobId, candidate_id, finalResumeUrl]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/my — candidate sees their own applications
const getMyApplications = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;

    const result = await pool.query(
      `SELECT 
         a.id, a.pipeline_stage, a.resume_url, a.created_at,
         j.title AS job_title, j.location, j.job_type, j.last_date, j.status AS job_status,
         c.name AS company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.candidate_id = $1
       ORDER BY a.created_at DESC`,
      [candidate_id]
    );

    res.status(200).json({ count: result.rows.length, applications: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/job/:jobId — company sees all applications for their job
const getApplicationsForJob = async (req, res, next) => {
  try {
    const company_id = req.user.id;
    const { jobId } = req.params;

    // Verify the job belongs to this company
    const job = await pool.query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [jobId, company_id]
    );
    if (job.rows.length === 0) {
      return res.status(403).json({ message: 'Job not found or not authorized' });
    }

    const result = await pool.query(
      `SELECT
         a.id, a.pipeline_stage, a.resume_url, a.created_at,
         ca.id AS candidate_id, ca.name, ca.email,
         ca.date_of_birth, ca.college, ca.cgpa,
         ca.year_of_graduation, ca.preferred_locations
       FROM applications a
       JOIN candidates ca ON a.candidate_id = ca.id
       WHERE a.job_id = $1
       ORDER BY a.created_at ASC`,
      [jobId]
    );

    res.status(200).json({ count: result.rows.length, applications: result.rows });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id/stage — company only
const updatePipelineStage = async (req, res, next) => {
  try {
    const company_id = req.user.id;
    const { id } = req.params;
    const { pipeline_stage } = req.body;

    const validStages = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
    if (!validStages.includes(pipeline_stage)) {
      return res.status(400).json({ message: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }

    // Verify the application belongs to a job owned by this company
    const check = await pool.query(
      `SELECT a.id FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1 AND j.company_id = $2`,
      [id, company_id]
    );
    if (check.rows.length === 0) {
      return res.status(403).json({ message: 'Application not found or not authorized' });
    }

    const result = await pool.query(
      `UPDATE applications SET pipeline_stage = $1 WHERE id = $2 RETURNING *`,
      [pipeline_stage, id]
    );

    res.status(200).json({ application: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id — candidate only, only if stage is still Applied
const withdrawApplication = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;
    const { id } = req.params;

    const application = await pool.query(
      'SELECT id, pipeline_stage FROM applications WHERE id = $1 AND candidate_id = $2',
      [id, candidate_id]
    );
    if (application.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.rows[0].pipeline_stage !== 'Applied') {
      return res.status(400).json({ message: 'Cannot withdraw application once it has been reviewed' });
    }

    await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    res.status(200).json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updatePipelineStage,
  withdrawApplication
};