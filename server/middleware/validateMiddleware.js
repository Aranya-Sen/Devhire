const validateRegisterCandidate = (req, res, next) => {
  const { name, email, password, cgpa, year_of_graduation } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (cgpa && (cgpa < 0 || cgpa > 10)) {
    return res.status(400).json({ message: 'CGPA must be between 0 and 10' });
  }
  if (year_of_graduation && (year_of_graduation < 1990 || year_of_graduation > 2030)) {
    return res.status(400).json({ message: 'Enter a valid year of graduation' });
  }

  next();
};

const validateRegisterCompany = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  next();
};

module.exports = { validateRegisterCandidate, validateRegisterCompany, validateLogin };