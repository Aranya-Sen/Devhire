const express = require('express');
const router = express.Router();
const { getResumeUploadUrl, confirmResumeUpload } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

// Step 1 — get pre-signed URL for direct S3 upload
router.post('/resume/presign', protect, authorize('candidate'), getResumeUploadUrl);

// Step 2 — confirm upload and save URL to DB
router.post('/resume/confirm', protect, authorize('candidate'), confirmResumeUpload);

router.post('/resume/view-url', protect, getResumeViewUrl);

module.exports = router;