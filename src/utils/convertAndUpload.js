"use strict";

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../db/init.sw3");
const crypto = require("crypto");

const uploadToS3 = async (bucket, key, body, contentType) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return s3Client.send(command);
};

// Generate a random ID with a specified length
const generateRandomId = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

const uploadVideo = async (file) => {
  const bucket = "khanh1632003";
  const keyLength = 5; // Choose a length between 20-30
  const randomId = generateRandomId(keyLength);
  const key = `${randomId}-${file.originalname}`;

  try {
    await uploadToS3(bucket, key, file.buffer, file.mimetype);

    // Generate a signed URL for the uploaded video file
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand);

    console.log(`Generated signed URL: ${signedUrl}`);
    return signedUrl;
  } catch (error) {
    console.error("Error uploading video to S3:", error);
    throw error;
  }
};

module.exports = uploadVideo;
