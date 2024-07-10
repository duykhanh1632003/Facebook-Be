"use strict";
const CommentService = require("../services/comment.service");
const { CREATED, SuccessResponse } = require("../core/success.response.js");

class CommentController {
  createNewCommentPost = async (req, res, next) => {
    const data = await CommentService.createNewCommentPost(req.body);
    console.log("check data", data);
    new SuccessResponse({ metadata: data }).send(res);
  };
  editCommentPost = async (req, res, next) => {
    const data = await CommentService.editCommentPost(req.body);
    console.log("check data", data);
    new SuccessResponse({ message: "Change comment done" }).send(res);
  };
  deleteCommentPost = async (req, res, next) => {
    const data = await CommentService.deleteCommentPost(req.body);
    new SuccessResponse({ message: "delete comment done" }).send(res);
  };
}

module.exports = new CommentController();
