"use strict";
const { BadRequestError } = require("../core/error.response.js");
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const uploadImageFromUrl = require("../services/upload.service.js");
const {
  uploadImageFromLocalToS3,
} = require("../services/uploadAWS.service.js");
const uploadVideo = require("../utils/convertAndUpload.js");

class UploadSW3Controller {
  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("Cannot have file");
    }
    new SuccessResponse({
      message: "Upload success",
      metadata: await uploadImageFromLocalToS3({
        path: file.path,
      }),
    });
  };
  uploadVideoToS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("Cannot have file");
    }
    const result = await uploadVideo(file);
    new SuccessResponse({
      message: "Upload success",
      metadata: result,
    }).send(res);
  };
}

module.exports = new UploadSW3Controller();
