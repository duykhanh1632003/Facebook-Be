"use strict";

const { BadRequestError } = require("../core/error.response");
const postRepository = require("../models/repositories/post.repo");
const userRepository = require("../models/repositories/user.repository");
const commentRepository = require("../models/repositories/comment.repo");
const friendListRepository = require("../models/repositories/friendList.repository");
const feelingPostRepository = require("../models/repositories/feelingPost.repository");
const client = require("../db/init.redis");

class PostService {
  static instance;

  constructor() {
    if (PostService.instance) {
      return PostService.instance;
    }

    PostService.instance = this;
  }

  async createPost({ content, image, author, likedPost, comments, share }) {
    const newPost = await postRepository.createPost({
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
  }

  async likedPost({ userId, postId, type }) {
    const lockKey = `post:${postId}:like:lock`;
    const lockTimeout = 5000;

    try {
      const existingLike = await feelingPostRepository.findOne({
        userId,
        postId,
      });
      if (existingLike) {
        await feelingPostRepository.findByIdAndDelete(existingLike._id);
        await postRepository.updateLikes(postId, existingLike._id, "pull");
      } else {
        const newLike = await feelingPostRepository.create({
          userId,
          postId,
          type,
        });
        await newLike.save();
        await postRepository.updateLikes(postId, newLike._id, "push");
      }

      const execResult = await multi.exec();
      if (!execResult) {
        throw new Error(
          "Transaction failed due to data modification, please try again"
        );
      }
      return existingLike
        ? { message: "Like removed" }
        : { message: "Like added" };
    } finally {
      await client.del(lockKey);
    }
  }

  async savePost({ userId, postId }) {
    const existingPost = await postRepository.findById(postId);
    if (!existingPost) {
      throw new Error("Post does not exist");
    }
    const findUser = await userRepository.findById(userId);
    if (!findUser) {
      throw new BadRequestError("User not found");
    }
    const isSaved = findUser.savePosts.includes(postId);
    if (isSaved) {
      findUser.savePosts = findUser.savePosts.filter((id) => id !== postId);
    } else {
      findUser.savePosts.push(postId);
    }
    await findUser.save();
  }

  async handleGetAllPosts({ userId, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const cacheKey = `post:${userId}:${page}:${limit}`;
    const cachedPosted = await client.get(cacheKey);
    if (cachedPosted) {
      return JSON.parse(cachedPosted);
    }

    const friendLists = await friendListRepository.findByUserId(userId);
    const friendIds = friendLists.reduce(
      (acc, fl) => acc.concat(fl.friends),
      []
    );
    friendIds.push(userId);

    const posts = await postRepository.findPostsByAuthors(
      friendIds,
      skip,
      limit
    );

    const postsWithCommentsAndLikes = await Promise.all(
      posts.map(async (p) => {
        const comments = await commentRepository.findByPostId(p._id);
        const likes = await feelingPostRepository.findLikesByIds(p.likes);
        const response = { ...p._doc, comments, likes };
        await client.setEx(cacheKey, 3600, JSON.stringify(response));
        return response;
      })
    );

    return postsWithCommentsAndLikes;
  }

  async handleGetDetailPost(postId) {
    const postDetail = await postRepository.findDetailById(postId);
    if (!postDetail) {
      throw new BadRequestError("Post not found");
    }
    const comments = await commentRepository.findByPostId(postId);
    return { postDetail, comments };
  }

  async getAllImagesByUserId({ userId }) {
    const cacheKey = `images:${userId}`;
    const cachedImages = await client.get(cacheKey);

    if (cachedImages) {
      return JSON.parse(cachedImages);
    }

    const posts = await postRepository.findImagesByUserId(userId);
    const images = posts.reduce((acc, post) => {
      if (post.image) {
        acc.push(post.image);
      }
      return acc;
    }, []);

    await client.setEx(cacheKey, 3600, JSON.stringify(images));
    return images;
  }
}

module.exports = new PostService();
