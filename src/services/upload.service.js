"use strict";

const cloudinary = require("../config/cloudinary.config");

const uploadImageFromUrl = async () => {
  try {
    const urlName = "";
    const folderName = "facebook/{userId}",
      newFileName = "image";
    const result = cloudinary.uploader.upload(urlName, {
      public_id: newFileName,
      folder: folderName,
    });
    console.log(result);
  } catch (e) {
    console.log(e)
  }
};
const uploadImageFromLocal = async ({ path, folderName = "facebook/8409" }) => {
  try {
    const result = cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    return {
      image_url: result.secure_url,
      shopId: "8409",
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (e) {
    console.log(e)
  }
};

module.exports = { uploadImageFromUrl, uploadImageFromLocal };
