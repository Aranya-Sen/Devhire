const pool = require('../config/db');
const { buildJobQuery } = require('../utils/apiFeatures');

// POST /api/jobs — company only
const createJob = async (req, res, next) => {
  try {
    const { title, description, location, job_type, tech_stack, min_cgpa, last_date } = req.body;
    const company_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO jobs (company_id, title, description, location, job_type, tech_stack, min_cgpa, last_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [company_id, title, description, location, job_type, tech_stack, min_cgpa, last_date]
    );

    res.status(201).json({ job: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs — public
const getAllJobs = async (req, res, next) => {
  try {
    const { whereClause, values } = buildJobQuery(req.query);

    const result = await pool.query(
      `SELECT j.*, c.name AS company_name, c.address AS company_address
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       ${whereClause}
       ORDER BY j.created_at DESC`,
      values
    );

    res.status(200).json({ count: result.rows.length, jobs: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/:id — public
const getJobById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name AS company_name, c.address AS company_address, c.no_of_employees
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ job: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/jobs/:id — company only, must own the job
const updateJob = async (req, res, next) => {
  try {
    const company_id = req.user.id;

    const existing = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND company_id = $2',
      [req.params.id, company_id]
    );
    if (existing.rows.length === 0) {
      return res.status(403).json({ message: 'Job not found or not authorized' });
    }

    const current = existing.rows[0];

    // Fall back to current DB values for any field not provided
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
       WHERE id=$9 AND company_id=$10
       RETURNING *`,
      [title, description, location, job_type, tech_stack, min_cgpa, last_date, status, req.params.id, company_id]
    );

    res.status(200).json({ job: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/jobs/:id — company only, must own the job
const deleteJob = async (req, res, next) => {
  try {
    const company_id = req.user.id;

    const existing = await pool.query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [req.params.id, company_id]
    );
    if (existing.rows.length === 0) {
      return res.status(403).json({ message: 'Job not found or not authorized' });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };