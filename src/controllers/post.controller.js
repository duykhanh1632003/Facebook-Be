"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const PostService = require("../services/post.service.js");

class PostController {
  handleAddNewPost = async (req, res, next) => {
    const data = await PostService.createPost(req.body);
    new SuccessResponse(data).send(res);
  };
  handleGetAllPosts = async (req, res, next) => {
    const response = await PostService.handleGetAllPosts(req.user.userId);
    new SuccessResponse({
      message: "Get  non-friends success",
      metadata: response,
    }).send(res);
  };
}

module.exports = new PostController();
