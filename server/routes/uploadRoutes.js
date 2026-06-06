const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Only candidates upload resumes
router.post('/resume', protect, authorize('candidate'), upload.single('resume'), uploadResume);

module.exports = router;