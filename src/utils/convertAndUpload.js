"use strict";

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../db/init.sw3");
const fs = require("fs-extra");
const path = require("path");
const { execFile } = require("child_process");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const uploadToS3 = async (bucket, key, body, contentType) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return s3Client.send(command);
};

const convertVideoToHLS = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      "-i",
      inputPath,
      "-profile:v",
      "baseline",
      "-level",
      "3.0",
      "-start_number",
      "0",
      "-hls_time",
      "10",
      "-hls_list_size",
      "0",
      "-f",
      "hls",
      path.join(outputPath, "index.m3u8"),
    ];

    execFile(ffmpegPath, ffmpegArgs, (error, stdout, stderr) => {
      if (error) {
        console.error("Error during HLS conversion", stderr);
        return reject(error);
      }
      console.log("HLS conversion finished", stdout);
      resolve();
    });
  });
};

const uploadHLSFilesToS3 = async (hlsDir, bucket) => {
  const files = await fs.readdir(hlsDir);
  const uploads = files.map((file) => {
    const filePath = path.join(hlsDir, file);
    const fileStream = fs.createReadStream(filePath);
    const contentType = file.endsWith(".m3u8")
      ? "application/x-mpegURL"
      : "video/MP2T";
    return uploadToS3(bucket, `hls/${file}`, fileStream, contentType);
  });
  return Promise.all(uploads);
};

const uploadVideo = async (file) => {
  const bucket = "khanh1632003";
  const tempDir = path.join(__dirname, "temp");
  await fs.ensureDir(tempDir);
  const inputPath = path.join(tempDir, file.originalname);
  await fs.writeFile(inputPath, file.buffer);
  const hlsDir = path.join(tempDir, "hls");
  await fs.ensureDir(hlsDir);
  try {
    await convertVideoToHLS(inputPath, hlsDir);
    await uploadHLSFilesToS3(hlsDir, bucket);

    // Generate a signed URL for the HLS master playlist (index.m3u8)
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: "hls/index.m3u8",
    });
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    console.log(`Generated signed URL: ${signedUrl}`);
    return signedUrl;
  } catch (error) {
    console.error("Error uploading video to S3:", error);
    throw error;
  }
};

module.exports = uploadVideo;
