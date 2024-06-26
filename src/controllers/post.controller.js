"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const PostService = require("../services/post.service.js");

class PostController {
  handleAddNewPost = async (req, res, next) => {
    const data = await PostService.createPost(req.body);
    new SuccessResponse(data).send(res);
  };

  handleGetAllPosts = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const response = await PostService.handleGetAllPosts({
      userId: req.user.userId,
      page: Number.parseInt(page, 10),
      limit: Number.parseInt(limit, 10),
    });
    new SuccessResponse({
      message: "Get posts success",
      metadata: response,
    }).send(res);
  };
  handlePostFeelingPost = async (req, res, next) => {
    await PostService.likedPost(req.body);
    new SuccessResponse({
      message: "Get posts success",
    }).send(res);
  };
}

module.exports = new PostController();
