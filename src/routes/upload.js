const express = require("express");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const router = express.Router();
require("dotenv").config();

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/upload", async (req, res) => {
  const { key, content, contentType } = req.body;

  const command = new PutObjectCommand({
    Bucket: "khanh1632003",
    Key: key,
    Body: content,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Failed to upload to S3" });
  }
});

module.exports = router;
