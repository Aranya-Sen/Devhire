const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updatePipelineStage,
  withdrawApplication
} = require('../controllers/applicationController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('company'), getApplicationsForJob);
router.post('/:jobId', protect, authorize('candidate'), applyToJob);
router.patch('/:id/stage', protect, authorize('company'), updatePipelineStage)
router.delete('/:id', protect, authorize('candidate'), withdrawApplication);

module.exports = router;