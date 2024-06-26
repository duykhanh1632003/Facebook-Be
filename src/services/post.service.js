"use strict";

const { BadRequestError } = require("../core/error.response");
const { post } = require("../models/post.model");
const { user } = require("../models/user.model");
const { comment } = require("../models/comment.model");
const friendList = require("../models/friendList");
const { feelingPost } = require("../models/feelingPost.model");
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

  static likedPost = async ({ userId, postId, type }) => {
    const existingPost = await post.findById(postId);
    if (!existingPost) {
      throw new Error("Post does not exist");
    }

    const existingLike = await feelingPost.findOne({ userId, postId });
    if (existingLike) {
      if (existingLike.type === type) {
        await existingLike.remove();
        existingPost.likes = existingPost.likes.filter(
          (id) => id.toString() !== existingLike._id.toString()
        );
      } else {
        existingLike.type = type;
        await existingLike.save();
      }
    } else {
      const newLike = await feelingPost.create({ userId, type });
      existingPost.likes.push(newLike._id);
      await newLike.save();
    }
    await existingPost.save();
  };

  static savePost = async ({ userId, postId }) => {
    const existingPost = await post.findById(postId);
    if (!existingPost) {
      throw new Error("Post does not exist");
    }
    const findUser = await user.findById(userId);
    if (!findUser) {
      throw new BadRequestError("User not found");
    }
    const isSaved = findUser.savePosts.includes(postId);
    if (isSaved) {
      findUser.savePosts = findUser.savePosts.filter((id) => id !== userId);
    } else {
      findUser.savePosts.push(postId);
    }
    await findUser.save();
  };

  static handleGetAllPosts = async ({ userId, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    // Get friend list
    const friendLists = await friendList.find({ user: userId });
    const friendIds = friendLists.reduce(
      (acc, fl) => acc.concat(fl.friends),
      []
    );

    // Add user's own ID to friend list
    friendIds.push(new mongoose.Types.ObjectId(userId));

    // Find posts by friends
    const posts = await post
      .find({ author: { $in: friendIds } })
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: -1 }) // Optionally, sort by creation date
      .skip(skip)
      .limit(limit)
      .exec();

    const postsWithCommentsAndLikes = await Promise.all(
      posts.map(async (p) => {
        const comments = await comment
          .find({ postId: p._id })
          .populate("userId", "firstName lastName avatar");

        const likes = await Promise.all(
          p.likes.map(async (likeId) => {
            const like = await feelingPost
              .findById(likeId)
              .populate("userId", "firstName lastName avatar");
            return like;
          })
        );

        return { ...p._doc, comments, likes };
      })
    );

    return postsWithCommentsAndLikes;
  };
}

module.exports = PostService;
