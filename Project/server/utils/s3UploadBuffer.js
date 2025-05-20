// utils/s3UploadBuffer.js
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3();

const uploadBufferToS3 = async (buffer, key, contentType = "application/pdf") => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // public URL
};

module.exports = uploadBufferToS3;
