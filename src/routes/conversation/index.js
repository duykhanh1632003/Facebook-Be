"use strict"

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const ConversationController = require("../../controllers/conversation.controller.js");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);
router.post("/new/conversation",asyncHandler(ConversationController.handleCreateConversation));
router.get("/all/conversation/:userId",asyncHandler(ConversationController.handleGetListConversations));

module.exports = router;