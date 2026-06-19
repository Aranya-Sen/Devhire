const pool = require('../config/db');
const { getUploadPresignedUrl, deleteResume } = require('../utils/s3Helper');

// Step 1 — candidate requests a pre-signed upload URL
// Frontend uses this URL to upload directly to S3
const getResumeUploadUrl = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({ message: 'fileName and contentType are required' });
    }

    if (contentType !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    // Generate unique filename to avoid collisions
    const uniqueFileName = `${candidate_id}-${Date.now()}-${fileName}`;
    const { uploadUrl, key, fileUrl } = await getUploadPresignedUrl(uniqueFileName, contentType);

    res.status(200).json({ uploadUrl, key, fileUrl });
  } catch (err) {
    next(err);
  }
};

// Step 2 — after frontend uploads to S3, it calls this to confirm
// and save the S3 URL to the candidate's profile
const confirmResumeUpload = async (req, res, next) => {
  try {
    const candidate_id = req.user.id;
    const { fileUrl, key } = req.body;

    if (!fileUrl || !key) {
      return res.status(400).json({ message: 'fileUrl and key are required' });
    }

    // Get old resume key to delete from S3
    const existing = await pool.query(
      'SELECT resume_url FROM candidates WHERE id = $1',
      [candidate_id]
    );

    const oldUrl = existing.rows[0].resume_url;

    // Delete old resume from S3 if exists
    if (oldUrl && oldUrl.includes('amazonaws.com')) {
      try {
        // Extract key from URL
        const oldKey = oldUrl.split('.amazonaws.com/')[1];
        await deleteResume(oldKey);
      } catch (deleteErr) {
        console.error('Could not delete old resume from S3:', deleteErr.message);
      }
    }

    // Update candidate's resume_url in DB
    await pool.query(
      'UPDATE candidates SET resume_url = $1 WHERE id = $2',
      [fileUrl, candidate_id]
    );

    res.status(200).json({
      message: 'Resume saved successfully',
      resume_url: fileUrl
    });
  } catch (err) {
    next(err);
  }
};

const getResumeViewUrl = async (req, res, next) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ message: 'key is required' });
    }

    const { getViewPresignedUrl } = require('../utils/s3Helper');
    const url = await getViewPresignedUrl(key);
    res.status(200).json({ url });
  } catch (err) {
    next(err);
  }
};

module.exports = { getResumeUploadUrl, confirmResumeUpload, getResumeViewUrl };