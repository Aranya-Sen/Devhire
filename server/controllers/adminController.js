const pool = require('../config/db');

// ─── CANDIDATES ──────────────────────────────────────────

const getAllCandidates = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, date_of_birth, gender, college,
              year_of_graduation, cgpa, preferred_locations, resume_url
       FROM candidates
       ORDER BY name ASC`
    );
    res.status(200).json({ count: result.rows.length, candidates: result.rows });
  } catch (err) {
    next(err);
  }
};

const getCandidateById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, date_of_birth, gender, college,
              year_of_graduation, cgpa, preferred_locations, resume_url
       FROM candidates WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ candidate: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM candidates WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    await pool.query('DELETE FROM candidates WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── COMPANIES ───────────────────────────────────────────

const getAllCompanies = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.email, c.address, c.no_of_employees,
              COUNT(j.id) AS total_jobs
       FROM companies c
       LEFT JOIN jobs j ON c.id = j.company_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.status(200).json({ count: result.rows.length, companies: result.rows });
  } catch (err) {
    next(err);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await pool.query(
      `SELECT c.id, c.name, c.email, c.address, c.no_of_employees,
              COUNT(j.id) AS total_jobs
       FROM companies c
       LEFT JOIN jobs j ON c.id = j.company_id
       WHERE c.id = $1
       GROUP BY c.id`,
      [req.params.id]
    );
    if (company.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Also get all jobs by this company
    const jobs = await pool.query(
      `SELECT id, title, location, job_type, status, last_date, created_at
       FROM jobs WHERE company_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.status(200).json({ company: company.rows[0], jobs: jobs.rows });
  } catch (err) {
    next(err);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM companies WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    // CASCADE in DB will delete their jobs and applications too
    await pool.query('DELETE FROM companies WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'Company and all associated jobs deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── JOBS ─────────────────────────────────────────────────

const getAllJobsAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name AS company_name,
              COUNT(a.id) AS total_applications
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       LEFT JOIN applications a ON j.id = a.job_id
       GROUP BY j.id, c.name
       ORDER BY j.created_at DESC`
    );
    res.status(200).json({ count: result.rows.length, jobs: result.rows });
  } catch (err) {
    next(err);
  }
};

const updateJobAdmin = async (req, res, next) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const current = existing.rows[0];

    const title = req.body.title ?? current.title;
    const description = req.body.description ?? current.description;
    const location = req.body.location ?? current.location;
    const job_type = req.body.job_type ?? current.job_type;
    const tech_stack = req.body.tech_stack ?? current.tech_stack;
    const min_cgpa = req.body.min_cgpa ?? current.min_cgpa;
    const last_date = req.body.last_date ?? current.last_date;
    const status = req.body.status ?? current.status;

    const result = await pool.query(
      `UPDATE jobs
       SET title=$1, description=$2, location=$3, job_type=$4,
           tech_stack=$5, min_cgpa=$6, last_date=$7, status=$8
       WHERE id=$9
       RETURNING *`,
      [title, description, location, job_type, tech_stack, min_cgpa, last_date, status, req.params.id]
    );

    res.status(200).json({ job: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteJobAdmin = async (req, res, next) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM jobs WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── APPLICATIONS ─────────────────────────────────────────

const getAllApplicationsAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         a.id, a.pipeline_stage, a.resume_url, a.created_at,
         ca.name AS candidate_name, ca.email AS candidate_email, ca.cgpa,
         j.title AS job_title, j.location,
         c.name AS company_name
       FROM applications a
       JOIN candidates ca ON a.candidate_id = ca.id
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       ORDER BY a.created_at DESC`
    );
    res.status(200).json({ count: result.rows.length, applications: result.rows });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStageAdmin = async (req, res, next) => {
  try {
    const { pipeline_stage } = req.body;

    const validStages = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
    if (!validStages.includes(pipeline_stage)) {
      return res.status(400).json({ message: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }

    const existing = await pool.query(
      'SELECT id FROM applications WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const result = await pool.query(
      'UPDATE applications SET pipeline_stage = $1 WHERE id = $2 RETURNING *',
      [pipeline_stage, req.params.id]
    );
    res.status(200).json({ application: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteApplicationAdmin = async (req, res, next) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM applications WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await pool.query('DELETE FROM applications WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── STATS ────────────────────────────────────────────────

const getPlatformStats = async (req, res, next) => {
  try {
    const [candidates, companies, jobs, applications, pipeline] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM candidates'),
      pool.query('SELECT COUNT(*) FROM companies'),
      pool.query('SELECT COUNT(*) FROM jobs'),
      pool.query('SELECT COUNT(*) FROM applications'),
      pool.query(
        `SELECT pipeline_stage, COUNT(*) AS count
         FROM applications
         GROUP BY pipeline_stage`
      )
    ]);

    res.status(200).json({
      stats: {
        total_candidates: parseInt(candidates.rows[0].count),
        total_companies: parseInt(companies.rows[0].count),
        total_jobs: parseInt(jobs.rows[0].count),
        total_applications: parseInt(applications.rows[0].count),
        pipeline_breakdown: pipeline.rows
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCandidates, getCandidateById, deleteCandidate,
  getAllCompanies, getCompanyById, deleteCompany,
  getAllJobsAdmin, updateJobAdmin, deleteJobAdmin,
  getAllApplicationsAdmin, updateApplicationStageAdmin, deleteApplicationAdmin,
  getPlatformStats
};