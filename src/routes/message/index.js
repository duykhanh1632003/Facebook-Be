"use strict"

const express = require("express");

const asyncHandler = require("../../helpers/asyncHandler");
const {authentication} = require("../../auth/authUtils");
const MessageController = require("../../controllers/message.controller");
const router = express.Router();

router.use(authentication);
router.post("/new/message",asyncHandler(MessageController.handleSendMessage));
router.get("/get/list/:conversationId",asyncHandler(MessageController.handleGetListMessage));
router.delete("/delete/message/:id",asyncHandler(MessageController.handleDeleteMessage));
module.exports = router;