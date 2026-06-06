const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('company'), createJob);
router.put('/:id', protect, authorize('company'), updateJob);
router.delete('/:id', protect, authorize('company'), deleteJob);

module.exports = router;