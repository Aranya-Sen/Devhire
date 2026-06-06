const express = require('express');
const router = express.Router();
const {
  getAllCandidates, getCandidateById, deleteCandidate,
  getAllCompanies, getCompanyById, deleteCompany,
  getAllJobsAdmin, updateJobAdmin, deleteJobAdmin,
  getAllApplicationsAdmin, updateApplicationStageAdmin, deleteApplicationAdmin,
  getPlatformStats
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/rbacMiddleware');

// All admin routes protected — admin role only
router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);

router.get('/candidates', getAllCandidates);
router.get('/candidates/:id', getCandidateById);
router.delete('/candidates/:id', deleteCandidate);

router.get('/companies', getAllCompanies);
router.get('/companies/:id', getCompanyById);
router.delete('/companies/:id', deleteCompany);

router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id', updateJobAdmin);
router.delete('/jobs/:id', deleteJobAdmin);

router.get('/applications', getAllApplicationsAdmin);
router.patch('/applications/:id/stage', updateApplicationStageAdmin);
router.delete('/applications/:id', deleteApplicationAdmin);

module.exports = router;