"use strict";

const userRepository = require("../models/repositories/user.repository");
const { BadRequestError } = require("../core/error.response");
const commentRepository = require("../models/repositories/comment.repo");

class CommentService {
  static instance;

  constructor() {
    if (CommentService.instance) {
      return CommentService.instance;
    }

    CommentService.instance = this;
  }

  async createNewCommentPost({
    message,
    postId,
    userId,
    parentId = null,
    childrenId = [],
  }) {
    const newComment = await commentRepository.createComment({
      message,
      postId,
      userId,
      parentId,
      childrenId,
      likes: [],
    });

    const userInfo = await userRepository.findById(
      userId,
      "firstName lastName avatar"
    );

    if (!newComment) {
      throw new BadRequestError("Cannot create new comment");
    }
    if (!userInfo) {
      throw new BadRequestError("User not found");
    }

    if (parentId) {
      await commentRepository.addReplyToComment(parentId, newComment._id);
    }

    const response = {
      ...newComment.toObject(),
      userId: {
        _id: userInfo._id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        avatar: userInfo.avatar,
      },
    };

    return response;
  }

  async editCommentPost({ message, commentId }) {
    const foundComment = await commentRepository.findById(commentId);
    if (!foundComment) {
      throw new BadRequestError("Comment not found");
    }
    foundComment.message = message;
    await foundComment.save();
  }

  async deleteCommentPost({ commentId }) {
    const deleteCommentsRecursive = async (commentId) => {
      const foundComment = await commentRepository.findById(commentId);
      if (!foundComment) {
        throw new BadRequestError("Comment not found");
      }
      if (foundComment.childrenId && foundComment.childrenId.length > 0) {
        for (const childId of foundComment.childrenId) {
          await deleteCommentsRecursive(childId);
        }
      }
      await commentRepository.deleteComment(commentId);
    };
    await deleteCommentsRecursive(commentId);
  }
}

module.exports = new CommentService();
