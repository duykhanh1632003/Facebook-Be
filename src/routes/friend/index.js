"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const friendController = require("../../controllers/friend.controller");
const router = express.Router();

router.use(authentication);
router.get(
  "/friend/canKnow",
  asyncHandler(friendController.handleGetNoneFriend)
);
router.post(
  "/friend/request",
  asyncHandler(friendController.handleSendFriendRequest)
);

router.post(
  "/friend/cancelRequest",
  asyncHandler(friendController.handleCancelFriendRequest)
);
router.get(
  "/friend/requests",
  asyncHandler(friendController.handleGetFriendRequests)
);

router.post(
  "/friend/acceptRequest",
  asyncHandler(friendController.handleAcceptFriendRequest)
);

router.get("/number/friend/:id", friendController.handleGetNumberOfFr);
router.get("/detailUser/user/:id", friendController.getDetailOfAUser);

module.exports = router;
