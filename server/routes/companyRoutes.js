const express = require('express');
const router = express.Router();
const {
  getMyProfile, updateMyProfile,
  getCompanyPublicProfile, getCompanyJobs,
  getMyStats
} = require('../controllers/companyController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.get('/profile', protect, authorize('company'), getMyProfile);
router.get('/stats', protect, authorize('company'), getMyStats);
router.put('/profile', protect, authorize('company'), updateMyProfile);
router.get('/:id', getCompanyPublicProfile);
router.get('/:id/jobs', getCompanyJobs);

module.exports = router;