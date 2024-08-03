"use strict";
const {  SuccessResponse } = require("../core/success.response.js");
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
  incrementVideoView = async (req, res) => {
    const { videoId } = req.body;
    const response = await WatchPostService.incrementVideoView(videoId);
    new SuccessResponse({
      message: "Video view incremented",
      metadata: response,
    }).send(res);
  };
}

module.exports = new WatchController();
