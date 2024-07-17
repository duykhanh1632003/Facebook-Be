"use strict";
const { BadRequestError } = require("../core/error.response.js");
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const WatchPostService = require("../services/watchPost.service.js");

class WatchController {
  handleGetAllPostsVideo = async (req, res, next) => {
    const response = await WatchPostService.handleGetAllPosts({
      userId: req.user.userId,
    });
    new SuccessResponse({
      message: "Get posts success",
      metadata: response,
    }).send(res);
  };
}

module.exports = new WatchController();
