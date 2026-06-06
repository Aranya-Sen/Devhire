const pool = require('../config/db');

// GET /api/candidates/profile — candidate sees their own profile
const getMyProfile = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;

    const result = await pool.query(
      `SELECT id, name, email, date_of_birth, gender, college,
              year_of_graduation, cgpa, preferred_locations, resume_url
       FROM candidates WHERE id = $1`,
      [candidate_id]
    );

    res.status(200).json({ candidate: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/candidates/profile — candidate updates their own profile
const updateMyProfile = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;
    const {
      name, date_of_birth, gender, college,
      year_of_graduation, cgpa, preferred_locations
    } = req.body;

    // Email and password not updatable here — separate flows needed for those
    const result = await pool.query(
      `UPDATE candidates
       SET name=$1, date_of_birth=$2, gender=$3, college=$4,
           year_of_graduation=$5, cgpa=$6, preferred_locations=$7
       WHERE id=$8
       RETURNING id, name, email, date_of_birth, gender, college,
                 year_of_graduation, cgpa, preferred_locations, resume_url`,
      [name, date_of_birth, gender, college, year_of_graduation, cgpa, preferred_locations, candidate_id]
    );

    res.status(200).json({ candidate: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyProfile, updateMyProfile };