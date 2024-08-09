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

  createNewAvatar = async (req, res, next) => {
    const { avatar } = req.body;
    try {
      const result = await AccessService.createNewAvatar({
        userId: req.user.userId,
        avatar: avatar,
      });
      new SuccessResponse({
        message: "Avatar updated successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  handleGetPassWordForgot = async (req, res) => {
    const result = await AccessService.handleGetPassWordForgot(req.body);
    new SuccessResponse({
      message: result,
    }).send(res);
  };

  changePassword = async (req, res, next) => {
    const result = await AccessService.changePassword(
      req.body,
      req.user.userId
    );
    new SuccessResponse({
      message: "Change Password success",
      metadata: result,
    }).send(res);
  };

  searchHistoryOfUser = async (req, res, next) => {
    const { userId, searchedUserId } = req.body;
    const result = await AccessService.searchHistoryOfUser({
      userId,
      searchedUserId,
    });
    new SuccessResponse({
      message: "Search history updated successfully",
      metadata: result,
    }).send(res);
  };

  getSearchHistoryOfUser = async (req, res, next) => {
    const { userId } = req.params;
    const result = await AccessService.getSearchHistoryOfUser(userId);
    new SuccessResponse({
      message: "Get search history successfully",
      metadata: result,
    }).send(res);
  };

  getInfUser = async (req, res, next) => {
    const result = await AccessService.getInfUser(req.query.email);
    new SuccessResponse({
      message: "Get Inf User success",
      metadata: result,
    }).send(res);
  };

  searchUser = async (req, res, next) => {
    const { query } = req.query;
    const result = await AccessService.searchUser({query,currentUserId:req.user.userId});
    new SuccessResponse({
      message: "Search user successfully",
      metadata: result,
    }).send(res);
  };
  removeUserFromSearch = async (req, res, next) => {
    const { userId } = req.body;
    const result = await AccessService.removeUserFromSearch({
      user: req.user.userId,
      searchedUsers: userId,
    });
    new SuccessResponse({
      message: "Remove user successfully",
    }).send(res);
  };
}

module.exports = new AccessController();
