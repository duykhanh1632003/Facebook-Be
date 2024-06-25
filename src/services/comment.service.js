"use strict";

const { comment } = require("../models/comment.model");

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
