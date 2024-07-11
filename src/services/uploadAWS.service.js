// uploadImage.js

"use strict";

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client, getObjectUrl } = require("./s3Client");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // ESM

const urlImagePublic = "https://d28nogkts3esfg.cloudfront.net";
const uploadImageFromLocalToS3 = async (file) => {
  try {
    if (!file) {
      throw new Error("File is not provided");
    }

    // const command = new PutObjectCommand({
    //   Bucket: process.env.BUCKET,
    //   Key: file.originalname || "unknown",
    //   Body: file.buffer,
    //   ContentType: file.mimetype || "image/jpeg",
    // });

    const result = await s3Client.send(command);
    // const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const signedUrl = getSignedUrl({
      url: `${urlImagePublic}/${file.originalname}`,
      keyPairId: "KYWG51LQ4V6KX",
      dateLessThan: new Date(Date.now() + 1000 * 60),
      privateKey: process.env.AWS_BUCKET_ACCESS_PRIVATEKEY,
    });
    return {
      url: `${file.originalname}/${urlImagePublic}`,
      result,
    };
  } catch (e) {
    console.error("Error uploading image to S3:", e);
    throw e;
  }
};

module.exports = { uploadImageFromLocalToS3 };
