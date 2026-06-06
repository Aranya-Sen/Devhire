const pool = require('../config/db');
const { uploadPDF, deletePDF } = require('../utils/cloudinaryHelper');

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const candidate_id = req.user.id;

    // Get existing resume public_id to delete old one from cloudinary
    const existing = await pool.query(
      'SELECT resume_url FROM candidates WHERE id = $1',
      [candidate_id]
    );

    const oldUrl = existing.rows[0].resume_url;

    // If old resume exists on cloudinary, delete it
    if (oldUrl && oldUrl.includes('cloudinary')) {
      // Extract public_id from URL
      // Cloudinary raw URL pattern: .../raw/upload/v123456/devhire/resumes/filename.pdf
      const parts = oldUrl.split('/');
      const fileWithExt = parts[parts.length - 1];
      const filename = fileWithExt.replace('.pdf', '');
      const publicId = `devhire/resumes/${filename}`;

      try {
        await deletePDF(publicId);
      } catch (deleteErr) {
        // Non-blocking — log but don't fail the upload
        console.error('Could not delete old resume from Cloudinary:', deleteErr.message);
      }
    }

    // Upload new resume
    const fileName = `${candidate_id}-${Date.now()}`;
    const result = await uploadPDF(req.file.buffer, fileName);

    // Update candidate's resume_url in DB
    await pool.query(
      'UPDATE candidates SET resume_url = $1 WHERE id = $2',
      [result.secure_url, candidate_id]
    );

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume_url: result.secure_url
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadResume };