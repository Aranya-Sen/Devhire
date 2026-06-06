const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({limit: '10kb'}));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'DevHire API is running' }));

// Routes (will be added part by part)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/devhire-admin', require('./routes/adminRoutes'));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));