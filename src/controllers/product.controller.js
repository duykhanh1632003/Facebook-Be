const RedisService = require("../services/redis.service");
const { SuccessResponse } = require("../core/success.response.js");

class RedisController {
  async handlePostBook(req, res, next) {
    try {
      const data = await RedisService.handlePostBook(req.body);
      new SuccessResponse({
        message: "Post book success",
        metadata: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  async handleGetBook(req, res, next) {
    try {
      const { name } = req.params;
      const data = await RedisService.handleGetBook(name);
      new SuccessResponse({ message: "Get book success", metadata: data }).send(
        res
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RedisController();
