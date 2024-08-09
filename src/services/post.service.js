"use strict";

const { BadRequestError } = require("../core/error.response");
const postRepository = require("../models/repositories/post.repo");
const userRepository = require("../models/repositories/user.repository");
const commentRepository = require("../models/repositories/comment.repo");
const friendListRepository = require("../models/repositories/friendList.repository");
const feelingPostRepository = require("../models/repositories/feelingPost.repository");

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
    // await ElasticsearchService.indexPost(newPost);
    return newPost;
  }

  async likedPost({ userId, postId, type }) {
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

    return existingLike
      ? { message: "Like removed" }
      : { message: "Like added" };
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
        return { ...p._doc, comments, likes };
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
    const posts = await postRepository.findImagesByUserId(userId);
    const images = posts.reduce((acc, post) => {
      if (post.image) {
        acc.push(post.image);
      }
      return acc;
    }, []);
    return images;
  }

  async deleteThisPost(postId) {
    const post = await postRepository.findById(postId)
    if (!post) {
      throw new BadRequestError("Post not found");
    }
    if (post.comments && post.comments.length > 0) {
      commentRepository.deleteMany({_id : { $in : post.comments}})
    }
    if (post.likes && post.likes.length > 0) {
      await feelingPostRepository.deleteMany({ _id : post.likes })
    }
    await postRepository.deleteThisPost(postId);
    return { message: "Post, comments, and likes deleted successfully" };
  }

}

module.exports = new PostService();
