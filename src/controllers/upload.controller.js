"use strict";
const { BadRequestError } = require("../core/error.response.js");
const {  SuccessResponse } = require("../core/success.response.js");
const uploadImageFromUrl = require("../services/upload.service.js");

class UploadController {
  uploadFile = async () => {
    new SuccessResponse({
      message: "Upload success",
      metadata: await uploadImageFromUrl(),
    });
  };

  uploadFileThumb = async (req) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("Cannot have file");
    }
    new SuccessResponse({
      message: "Upload success",
      metadata: await uploadImageFromUrl.uploadImageFromLocal({
        path: file.path,
      }),
    });
  };
}

module.exports = new UploadController();
