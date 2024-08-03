"use strict";
const { BadRequestError } = require("../core/error.response.js");
const {  SuccessResponse } = require("../core/success.response.js");
const {
  uploadImageFromLocalToS3,
  uploadVideoToS3,
} = require("../services/uploadAWS.service.js");

class UploadSW3Controller {
  uploadFileThumb = async (req, res) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("Cannot have file");
    }
    new SuccessResponse({
      message: "Upload success",
      metadata: await uploadImageFromLocalToS3({
        path: file.path,
      }),
    }).send(res);
  };

  uploadVideoToS3 = async (req, res) => {
    const { file } = req;
    const { content, author } = req.body;

    if (!file) {
      throw new BadRequestError("Cannot have file");
    }

    const result = await uploadVideoToS3({ file, content, author });
    new SuccessResponse({
      message: "Upload success",
      metadata: result,
    }).send(res);
  };
}

module.exports = new UploadSW3Controller();
