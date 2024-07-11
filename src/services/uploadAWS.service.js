"use strict";

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner"); // Cập nhật đúng thư viện
const { s3Client } = require("../db/init.sw3");
const uploadVideo = require("../utils/convertAndUpload");

const urlImagePublic = "https://d28nogkts3esfg.cloudfront.net";

const uploadImageFromLocalToS3 = async (file) => {
  try {
    if (!file) {
      throw new Error("File is not provided");
    }

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: file.originalname || "unknown",
      Body: file.buffer,
      ContentType: file.mimetype || "image/jpeg",
    });

    const result = await s3Client.send(command);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return {
      url: `${urlImagePublic}/${file.originalname}`,
      result,
      signedUrl,
    };
  } catch (e) {
    console.error("Error uploading image to S3:", e);
    throw e;
  }
};

const uploadVideoToS3 = async (file) => {
  try {
    if (!file) {
      throw new Error("file not found");
    }
    const videoUrl = await uploadVideo(file);
    return {
      url: videoUrl,
    };
  } catch (e) {
    console.error("Error uploading video to S3:", e);
    throw e;
  }
};

module.exports = { uploadImageFromLocalToS3, uploadVideoToS3 };
