"use strict";
const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response.js");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    const data = await AccessService.handlerRefreshToken(req.body.refreshToken);
    new SuccessResponse({ message: "Get token success", metadata: data }).send(
      res
    );
  };

  login = async (req, res, next) => {
    const data = await AccessService.login(req.body);
    new SuccessResponse({ metadata: data }).send(res);
  };
  logout = async (req, res, next) => {
    const data = await AccessService.logout(req.keyStore);
    new SuccessResponse({ message: "Logout success", metadata: data }).send(
      res
    );
  };

  signup = async (req, res, next) => {
    const data = await AccessService.signUp(req.body);
    new SuccessResponse({
      message: "Registered OK",
      metadata: data,
      options: { limit: 10 },
    }).send(res);
  };
  static refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    const result = await AccessService.refreshAccessToken(refreshToken);
    return res.status(200).json(result);
  };
}

module.exports = new AccessController();
