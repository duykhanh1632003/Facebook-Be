"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const RedisService = require("../services/redis.service.js");

class RedisController {
  handlePostBook = async (req, res, next) => {
    const data = await RedisService.handlePostBook(req.body);
    new SuccessResponse({ message: "post book success", metadata: data }).send(
      res
    );
  };

  handleGetBook = async (req, res, next) => {
    const { name } = req.body;
    const data = await RedisService.handleGetBook(name);
    new SuccessResponse({ message: "post book success", metadata: data }).send(
      res
    );
  };
}

module.exports = new RedisController();
