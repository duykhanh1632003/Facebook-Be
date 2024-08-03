"use strict";
const {  SuccessResponse } = require("../core/success.response.js");
const RedisService = require("../services/redis.service.js");

class RedisController {
  handlePostBook = async (req, res) => {
    const data = await RedisService.handlePostBook(req.body);
    new SuccessResponse({ message: "post book success", metadata: data }).send(
      res
    );
  };

  handleGetBook = async (req, res) => {
    const { name } = req.body;
    const data = await RedisService.handleGetBook(name);
    new SuccessResponse({ message: "post book success", metadata: data }).send(
      res
    );
  };
}

module.exports = new RedisController();
