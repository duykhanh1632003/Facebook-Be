"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../config/multer.config");
const uploadSW3Controller = require("../../controllers/uploadSW3.controller");
const router = express.Router();
router.post(
  "/upload/video",
  uploadMemory.single("file"),
  asyncHandler(uploadSW3Controller.uploadVideoToS3)
);

router.use(authentication);
router.post("/upload", asyncHandler(uploadSW3Controller.uploadFile));
router.post(
  "/upload/disk",
  uploadDisk.single(),
  asyncHandler(uploadSW3Controller.uploadFileThumb)
);

module.exports = router;
