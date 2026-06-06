const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const generateToken = require('../utils/generateToken');

// ─── CANDIDATE ───────────────────────────────────────────
const registerCandidate = async (req, res, next) => {
  try {
    const {
      name, email, password, date_of_birth,
      gender, college, year_of_graduation,
      cgpa, preferred_locations
    } = req.body;

    const exists = await pool.query(
      'SELECT id FROM candidates WHERE email = $1', [email]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO candidates
        (name, email, hashed_password, date_of_birth, gender, college, year_of_graduation, cgpa, preferred_locations)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name, email`,
      [name, email, hashed_password, date_of_birth, gender, college, year_of_graduation, cgpa, preferred_locations]
    );

    const candidate = result.rows[0];
    const token = generateToken(candidate.id, 'candidate');

    res.status(201).json({ token, user: candidate });
  } catch (err) {
    next(err);
  }
};

const loginCandidate = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM candidates WHERE email = $1', [email]
    );
    const candidate = result.rows[0];

    if (!candidate || !(await bcrypt.compare(password, candidate.hashed_password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(candidate.id, 'candidate');
    res.status(200).json({
      token,
      user: { id: candidate.id, name: candidate.name, email: candidate.email, role: 'candidate' }
    });
  } catch (err) {
    next(err);
  }
};

// ─── COMPANY ─────────────────────────────────────────────
const registerCompany = async (req, res, next) => {
  try {
    const { name, email, password, address, no_of_employees } = req.body;

    const exists = await pool.query(
      'SELECT id FROM companies WHERE email = $1', [email]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO companies (name, email, hashed_password, address, no_of_employees)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, name, email`,
      [name, email, hashed_password, address, no_of_employees]
    );

    const company = result.rows[0];
    const token = generateToken(company.id, 'company');

    res.status(201).json({ token, user: company });
  } catch (err) {
    next(err);
  }
};

const loginCompany = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM companies WHERE email = $1', [email]
    );
    const company = result.rows[0];

    if (!company || !(await bcrypt.compare(password, company.hashed_password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(company.id, 'company');
    res.status(200).json({
      token,
      user: { id: company.id, name: company.name, email: company.email, role: 'company' }
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN ───────────────────────────────────────────────
const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await pool.query(
      'SELECT id FROM admins WHERE email = $1', [email]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO admins (name, email, hashed_password)
       VALUES ($1,$2,$3)
       RETURNING id, name, email`,
      [name, email, hashed_password]
    );

    const admin = result.rows[0];
    const token = generateToken(admin.id, 'admin');

    res.status(201).json({ token, user: admin });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1', [email]
    );
    const admin = result.rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.hashed_password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(admin.id, 'admin');
    res.status(200).json({
      token,
      user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' }
    });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const { id, role } = req.user;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const table = role === 'candidate' ? 'candidates' : role === 'company' ? 'companies' : 'admins';

    const result = await pool.query(
      `SELECT hashed_password FROM ${table} WHERE id = $1`,
      [id]
    );

    const isMatch = await bcrypt.compare(current_password, result.rows[0].hashed_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashed_password = await bcrypt.hash(new_password, 10);
    await pool.query(
      `UPDATE ${table} SET hashed_password = $1 WHERE id = $2`,
      [hashed_password, id]
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerCandidate, loginCandidate,
  registerCompany, loginCompany,
  registerAdmin, loginAdmin,
  changePassword
};