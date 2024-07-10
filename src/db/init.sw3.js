const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}
module.exports = { getObjectUrl };
