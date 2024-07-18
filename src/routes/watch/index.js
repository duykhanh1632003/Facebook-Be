"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const watchController = require("../../controllers/watch.controller");
const router = express.Router();

router.use(authentication);

router.get("/get/allVideo", asyncHandler(watchController.handleGetAllPostsVideo));
router.post("/upload/video/firebase", asyncHandler(watchController.postVideoFromUser));

module.exports = router;
