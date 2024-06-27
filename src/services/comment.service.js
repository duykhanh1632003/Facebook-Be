"use strict";

const { comment } = require("../models/comment.model");
const { post } = require("../models/post.model");
const { user } = require("../models/user.model");
const { likeComment } = require("../models/likeComment.model");

class CommentService {
  static createNewCommentPost = async ({ postId, body, userId }) => {
    const { message } = body;
    const response = comment.create({
      postId,
      message,
      userId,
    });
  };
}
