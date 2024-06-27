"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CommentController = require("../../controllers/comment.Controller");
const router = express.Router();

router.use(authentication);
router.post(
  "/new/commentPost",
  asyncHandler(CommentController.createNewCommentPost)
);

module.exports = router;
