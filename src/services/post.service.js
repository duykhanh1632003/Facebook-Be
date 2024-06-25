"use strict";

const { BadRequestError } = require("../core/error.response");
const { post } = require("../models/post.model");
const { user } = require("../models/user.model");
const { likeComment } = require("../models/likeComment.model");
const { comment } = require("../models/comment.model");
const friendList = require("../models/friendList");
const mongoose = require("mongoose");

class PostService {
  static createPost = async ({
    content,
    image,
    author,
    likedPost,
    comments,
    share,
  }) => {
    const newPost = await post.create({
      content,
      image,
      author,
      likedPost,
      comments,
      share,
    });
    if (!newPost) {
      throw new BadRequestError("Cannot create post");
    }
    return newPost;
  };

  static likedPost = async ({ userId, postId }) => {
    const existingPost = await post.findById(postId);
    if (!existingPost) {
      throw new Error("Bài đăng không tồn tại");
    }
    const isLiked = existingPost.likes.includes(userId);
    if (isLiked) {
      existingPost.likes = existingPost.likes.filter((id) => id !== userId);
    } else {
      existingPost.likes.push(userId);
    }
    await existingPost.save();
  };

  static savePost = async ({ userId, postId }) => {
    const existingPost = await post.findById(postId);
    if (!existingPost) {
      throw new Error("Bài đăng không tồn tại");
    }
    const findUser = await user.findById(userId);
    if (!findUser) {
      throw new BadRequestError("Không tìm được user");
    }
    const isSaved = findUser.savePosts.includes(postId);
    if (isSaved) {
      findUser.savePosts = findUser.savePosts.filter((id) => id !== userId);
    } else {
      findUser.savePosts.push(userId);
    }
    await findUser.save();
  };

  static handleGetAllPosts = async (userId) => {
    const posts = await post
      .find()
      .populate("author", "firstName lastName avatar")
      .populate("comments");

    const friendLists = await friendList.find({ user: userId });

    // Tạo một mảng chứa tất cả các ID của bạn bè
    const friendIds = friendLists.reduce((acc, fl) => {
      return acc.concat(fl.friends);
    }, []);

    // Thêm ID của bản thân người dùng vào mảng friendIds
    friendIds.push(new mongoose.Types.ObjectId(userId));
    console.log("check fri", friendIds);

    // Lọc bài đăng của bạn bè và của bản thân
    const allPosts = posts.filter((p) =>
      friendIds.some((id) => id.equals(p.author._id))
    );
    console.log("Check all", allPosts);

    // Lấy tất cả các comments cho các bài đăng đã lọc
    const postsWithComments = await Promise.all(
      allPosts.map(async (p) => {
        const comments = await comment
          .find({ postId: p._id })
          .populate("userId", "firstName lastName avatar");
        return { ...p._doc, comments };
      })
    );
    console.log("postsWithComments", postsWithComments);
    return postsWithComments;
  };
}

module.exports = PostService;
