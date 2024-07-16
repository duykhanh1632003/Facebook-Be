"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../config/multer.config");
const uploadSW3Controller = require("../../controllers/uploadSW3.controller");
const router = express.Router();

router.use(authentication);
router.post("/upload/video", asyncHandler(uploadSW3Controller.uploadVideoToS3));
router.post("/upload/disk", asyncHandler(uploadSW3Controller.uploadFileThumb));

module.exports = router;
