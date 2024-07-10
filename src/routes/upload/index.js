"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const accessController = require("../../controllers/access.controller");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../config/multer.config");
const router = express.Router();

router.use(authentication);
router.post("/upload", asyncHandler(uploadController.uploadFile));
router.post(
  "/upload/disk",
  uploadDisk.single(),
  asyncHandler(uploadController.uploadFileThumb)
);

module.exports = router;
