"use strict";

const User = require("../user.model").user;
const Post = require("../post.model").post;

// Hàm thêm like cho bài đăng
const likePost = async ({ postId, userId }) => {
  try {
    // Thêm postId vào mảng likedPosts của user
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { likedPosts: postId } }, // $addToSet để tránh thêm trùng lặp
      { new: true }
    );

    // Thêm userId vào mảng likes của post
    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // $addToSet để tránh thêm trùng lặp
      { new: true }
    );

    return 1; // Thành công
  } catch (error) {
    console.error(error);
    return -1; // Thất bại
  }
};

// Hàm hủy like cho bài đăng
const unlikePost = async ({ postId, userId }) => {
  try {
    // Xóa postId khỏi mảng likedPosts của user
    await User.findByIdAndUpdate(
      userId,
      { $pull: { likedPosts: postId } },
      { new: true }
    );

    // Xóa userId khỏi mảng likes của post
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    return 1; // Thành công
  } catch (error) {
    console.error(error);
    return -1; // Thất bại
  }
};

module.exports = { likePost, unlikePost };
