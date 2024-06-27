"use strict";
const CommentService = require("../services/comment.service");
const { CREATED, SuccessResponse } = require("../core/success.response.js");

class CommentController {
  createNewCommentPost = async (req, res, next) => {
    const data = await CommentService.createNewCommentPost(req.body);
    new SuccessResponse(data).send(res);
  };
}

module.exports = new CommentController();
