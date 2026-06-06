const pool = require('../config/db');

// GET /api/companies/profile — company sees their own full profile
const getMyProfile = async (req, res, next) => {
  try {
    const company_id = req.user.id;

    const result = await pool.query(
      `SELECT c.id, c.name, c.email, c.address, c.no_of_employees,
              COUNT(j.id) AS total_jobs,
              COUNT(CASE WHEN j.status = 'open' THEN 1 END) AS open_jobs
       FROM companies c
       LEFT JOIN jobs j ON c.id = j.company_id
       WHERE c.id = $1
       GROUP BY c.id`,
      [company_id]
    );

    res.status(200).json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/companies/profile — company updates their own profile
const updateMyProfile = async (req, res, next) => {
  try {
    const company_id = req.user.id;
    const { name, address, no_of_employees } = req.body;

    const result = await pool.query(
      `UPDATE companies
       SET name=$1, address=$2, no_of_employees=$3
       WHERE id=$4
       RETURNING id, name, email, address, no_of_employees`,
      [name, address, no_of_employees, company_id]
    );

    res.status(200).json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/companies/:id — public profile of a company
const getCompanyPublicProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.address, c.no_of_employees,
              COUNT(j.id) AS total_jobs,
              COUNT(CASE WHEN j.status = 'open' THEN 1 END) AS open_jobs
       FROM companies c
       LEFT JOIN jobs j ON c.id = j.company_id
       WHERE c.id = $1
       GROUP BY c.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/companies/:id/jobs — public, all open jobs by a company
const getCompanyJobs = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, location, job_type, tech_stack,
              min_cgpa, status, last_date, created_at
       FROM jobs
       WHERE company_id = $1 AND status = 'open'
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.status(200).json({ count: result.rows.length, jobs: result.rows });
  } catch (err) {
    next(err);
  }
};

const getMyStats = async (req, res, next) => {
  try {
    const company_id = req.user.id;

    const [jobStats, pipelineStats, recentApplications] = await Promise.all([
      pool.query(
        `SELECT
           COUNT(*) AS total_jobs,
           COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_jobs,
           COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_jobs
         FROM jobs WHERE company_id = $1`,
        [company_id]
      ),
      pool.query(
        `SELECT a.pipeline_stage, COUNT(*) AS count
         FROM applications a
         JOIN jobs j ON a.job_id = j.id
         WHERE j.company_id = $1
         GROUP BY a.pipeline_stage`,
        [company_id]
      ),
      pool.query(
        `SELECT
           a.id, a.pipeline_stage, a.created_at,
           ca.name AS candidate_name, ca.cgpa,
           j.title AS job_title
         FROM applications a
         JOIN candidates ca ON a.candidate_id = ca.id
         JOIN jobs j ON a.job_id = j.id
         WHERE j.company_id = $1
         ORDER BY a.created_at DESC
         LIMIT 5`,
        [company_id]
      )
    ]);

    res.status(200).json({
      stats: {
        jobs: jobStats.rows[0],
        pipeline_breakdown: pipelineStats.rows,
        recent_applications: recentApplications.rows
      }
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { getMyProfile, updateMyProfile, getCompanyPublicProfile, getCompanyJobs, getMyStats};