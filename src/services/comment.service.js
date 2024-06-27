"use strict";

const { comment } = require("../models/comment.model");
const { post } = require("../models/post.model");
const { user } = require("../models/user.model");
const { likeComment } = require("../models/likeComment.model");
const { BadRequestError } = require("../core/error.response");

class CommentService {
  static createNewCommentPost = async ({ message, postId, userId }) => {
    const response = comment.create({
      message,
      postId,
      userId,
      parentId: null,
      childrenId: [],
      likes: [],
    });

    if (!response) {
      throw new BadRequestError("Cannot create new comment");
    }
    return response;
  };
}

module.exports = CommentService;
