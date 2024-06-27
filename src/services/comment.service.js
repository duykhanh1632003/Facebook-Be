"use strict";

const { comment } = require("../models/comment.model");
const { post } = require("../models/post.model");
const { user } = require("../models/user.model");
const { likeComment } = require("../models/likeComment.model");
const { BadRequestError } = require("../core/error.response");

class CommentService {
  static createNewCommentPost = async ({ message, postId, userId }) => {
    const newComment = await comment.create({
      message,
      postId,
      userId,
      parentId: null,
      childrenId: [],
      likes: [],
    });
    const userInfo = await user
      .findById(userId)
      .select("firstName lastName avatar")
      .exec();

    if (!newComment) {
      throw new BadRequestError("Cannot create new comment");
    }
    if (!userInfo) {
      throw new BadRequestError("User not found");
    }

    // Kết hợp thông tin bình luận và người dùng
    const response = {
      ...newComment.toObject(),
      userId: {
        _id: userInfo._id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        avatar: userInfo.avatar,
      },
    };
    console.log("check avt", response);
    return response;
  };
}

module.exports = CommentService;
