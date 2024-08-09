const { comment } = require("../comment.model");

class CommentRepository {
  async createComment({
    message,
    postId,
    userId,
    parentId,
    childrenId,
    likes,
  }) {
    return await comment.create({
      message,
      postId,
      userId,
      parentId,
      childrenId,
      likes,
    });
  }

  async addReplyToComment(parentId, commentId) {
    return await comment.findByIdAndUpdate(parentId, {
      $push: { childrenId: commentId },
    });
  }

  async findById(commentId) {
    return await comment.findById(commentId);
  }

  async deleteComment(commentId) {
    return await comment.findByIdAndDelete(commentId);
  }

  async findByPostId(postId) {
    return await comment
      .find({ postId })
      .populate("userId", "firstName lastName avatar")
      .exec();
  }
  
  async deleteMany(filter) {
    return await comment.deleteMany(filter)
  }
}

module.exports = new CommentRepository();
