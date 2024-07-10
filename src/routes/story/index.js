"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const PostController = require("../../controllers/post.controller");
const storyController = require("../../controllers/story.controller");
const router = express.Router();

router.use(authentication);
router.post("/stories/image", asyncHandler(storyController.postStoryImage));
router.post("/stories/text", asyncHandler(storyController.postStoryText));
router.get("/stories", asyncHandler(storyController.getStories));

module.exports = router;
