"use strict";

const { comment } = require("../models/comment.model");
const { post } = require("../models/post.model");
const { user } = require("../models/user.model");
const { likeComment } = require("../models/likeComment.model");
const { BadRequestError } = require("../core/error.response");

class CommentService {
  static createNewCommentPost = async ({
    message,
    postId,
    userId,
    parentId = null,
    childrenId = [],
  }) => {
    // Tạo comment mới
    const newComment = await comment.create({
      message,
      postId,
      userId,
      parentId,
      childrenId,
      likes: [],
    });

    // Lấy thông tin người dùng
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

    // Nếu comment là reply thì cập nhật childrenId của parent comment
    if (parentId) {
      await comment.findByIdAndUpdate(parentId, {
        $push: { childrenId: newComment._id },
      });
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

  static editCommentPost = async ({ message, commentId }) => {
    const foundComment = await comment.findById(commentId);
    if (!foundComment) {
      throw new BadRequestError("Comment not found");
    }
    foundComment.message = message;
    await foundComment.save();
  };
  static deleteCommentPost = async ({ commentId }) => {
    console.log("Check commnet,comment", commentId);
    const deleteCommentsRecursive = async (commentId) => {
      const foundComment = await comment.findById(commentId);
      if (!foundComment) {
        throw new BadRequestError("Comment not found");
      }
      if (foundComment.childrenId && foundComment.childrenId.length > 0) {
        for (const childId of foundComment.childrenId) {
          await deleteCommentsRecursive(childId);
        }
      }
      await comment.findByIdAndDelete(commentId);
    };
    await deleteCommentsRecursive(commentId);
  };
}

module.exports = CommentService;
