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
router.post(
  "/edit/commentPost",
  asyncHandler(CommentController.editCommentPost)
);
router.post(
  "/delete/commentPost",
  asyncHandler(CommentController.deleteCommentPost)
);
module.exports = router;
