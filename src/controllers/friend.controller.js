"use strict";
const { SuccessResponse } = require("../core/success.response");
const FriendService = require("../services/friend.service");

class FriendController {
  handleGetNoneFriend = async (req, res, next) => {
    const data = await FriendService.getNonFriends(req.query.userId);
    new SuccessResponse({
      message: "Get non-friends success",
      metadata: data,
    }).send(res);
  };
  handleSendFriendRequest = async (req, res, next) => {
    const data = await FriendService.sendFriendRequest(req.body);
    new SuccessResponse({
      message: "Post request-friends success",
    }).send(res);
  };
  handleCancelFriendRequest = async (req, res, next) => {
    const data = await FriendService.cancelFriendRequest(req.body);
    new SuccessResponse({
      message: "Cancel request-friends success",
    }).send(res);
  };
  handleGetFriendRequests = async (req, res, next) => {
    console.log("Check query", req.query);

    const data = await FriendService.getFriendRequests(req.query.userId);
    new SuccessResponse({
      message: "Get friend requests success",
      metadata: data,
    }).send(res);
  };

  handleAcceptFriendRequest = async (req, res, next) => {
    const data = await FriendService.acceptFriendRequest(req.body);
    new SuccessResponse({
      message: "Friend request accepted",
      metadata: data,
    }).send(res);
  };

  handleGetNumberOfFr = async (req, res, next) => {
    const data = await FriendService.handleGetNumberOfFr(req.params.id);
    new SuccessResponse({
      message: "Friend get number access",
      metadata: data,
    }).send(res);
  };
  getDetailOfAUser = async (req, res, next) => {
    const data = await FriendService.getDetailOfAUser({
      idAnother: req.params.id,
      userId: req.user.userId,
    });
    new SuccessResponse({
      message: "Friend get number access",
      metadata: data,
    }).send(res);
  };
}

module.exports = new FriendController();
