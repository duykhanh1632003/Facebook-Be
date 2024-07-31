"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const discountService = require("../services/discount.service.js");

class DiscountController {
  createNewCommentPost = async (req, res, next) => {
    const data = await discountService.createNewCommentPost(req.body);
    console.log("check data", data);
    new SuccessResponse({ metadata: data }).send(res);
  };
}

module.exports = new DiscountController();
