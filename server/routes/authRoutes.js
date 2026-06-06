const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  registerCandidate, loginCandidate,
  registerCompany, loginCompany,
  registerAdmin, loginAdmin,
  changePassword
} = require('../controllers/authController');
const {
  validateRegisterCandidate,
  validateRegisterCompany,
  validateLogin
} = require('../middleware/validateMiddleware');

router.post('/register/candidate', registerCandidate);
router.post('/register/company', registerCompany);
router.post('/register/admin', registerAdmin);

router.post('/login/candidate', loginCandidate);
router.post('/login/company', loginCompany);
router.post('/login/admin', loginAdmin);

router.put('/change-password', protect, changePassword);

module.exports = router;