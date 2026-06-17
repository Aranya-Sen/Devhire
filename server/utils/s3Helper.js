const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// On EC2 credentials come from IAM role automatically
// For local dev credentials come from AWS CLI profile (~/.aws/credentials)
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1'
});

const BUCKET = process.env.S3_BUCKET_NAME;

// Generate a pre-signed PUT URL for frontend to upload directly to S3
const getUploadPresignedUrl = async (fileName, contentType) => {
  const { PutObjectCommand } = require('@aws-sdk/client-s3');

  const key = `resumes/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 minutes

  return {
    uploadUrl: url,
    key: key,
    // This is the permanent S3 object URL stored in DB after upload
    fileUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  };
};

// Generate a pre-signed GET URL for viewing a resume (15 min expiry)
const getViewPresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  });

  return getSignedUrl(s3, command, { expiresIn: 900 });
};

// Delete a resume from S3
const deleteResume = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key
  });

  return s3.send(command);
};

module.exports = { getUploadPresignedUrl, getViewPresignedUrl, deleteResume };