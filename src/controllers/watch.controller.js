"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const WatchPostService = require("../services/watchPost.service.js");

class WatchController {
  handleGetAllPostsVideo = async (req, res, next) => {
    try {
      const response = await WatchPostService.handleGetAllPosts({
        userId: req.user.userId,
      });
      new SuccessResponse({
        message: "Get posts success",
        metadata: response,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  postVideoFromUser = async (req, res, next) => {
    try {
      console.log("req.body", req.body);
      const { content, videoUrl, author } = req.body; // Ensure req.body is destructured properly
      const response = await WatchPostService.postVideoFromUser({
        content,
        videoUrl,
        author,
      });
      new SuccessResponse({
        message: "Post video success",
        metadata: response,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new WatchController();
