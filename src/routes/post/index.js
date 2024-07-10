"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const PostController = require("../../controllers/post.controller");
const router = express.Router();

router.use(authentication);
router.post("/new/post", asyncHandler(PostController.handleAddNewPost));
router.get("/get/allPosts", asyncHandler(PostController.handleGetAllPosts));
router.post(
  "/post/feelingPost",
  asyncHandler(PostController.handlePostFeelingPost)
);
router.get(
  "/get/detailPost/:id",
  asyncHandler(PostController.handleGetDetailPost)
);

router.get(
  "/get/userImages/:userId",
  asyncHandler(PostController.handleGetAllImagesByUserId)
);
module.exports = router;
