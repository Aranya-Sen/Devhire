const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/candidateController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.get('/profile', protect, authorize('candidate'), getMyProfile);
router.put('/profile', protect, authorize('candidate'), updateMyProfile);

module.exports = router;