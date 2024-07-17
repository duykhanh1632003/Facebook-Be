"use strict";

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner"); // Cập nhật đúng thư viện
const { s3Client } = require("../db/init.sw3");
const uploadVideo = require("../utils/convertAndUpload");
const { BadRequestError } = require("../core/error.response");
const { postVideo } = require("../models/post.video.model");

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

const uploadVideoToS3 = async (file, content, author) => {
  try {
    if (!file) {
      throw new Error("file not found");
    }
    const videoUrl = await uploadVideo(file);
    const saveVideo = await postVideo.create({
      content: content,
      videoUrl: videoUrl,
      author,
      likes: [],
      share: [],
      comments: [],
    });
    if (!saveVideo) {
      throw new BadRequestError("Cannot save video to db");
    }
    return {
      url: videoUrl,
    };
  } catch (e) {
    console.error("Error uploading video to S3:", e);
    throw e;
  }
};

const getVideoFromKey = async (key) => {
  const bucket = "duykhanh1632003";
  try {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });
    if (!signedUrl) {
      throw BadRequestError("Cannot get signedUrl");
    }
    return signedUrl;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { uploadImageFromLocalToS3, uploadVideoToS3, getVideoFromKey };
