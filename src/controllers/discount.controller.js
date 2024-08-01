"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const discountService = require("../services/discount.service.js");

class DiscountController {
  createNewDiscount = async (req, res, next) => {
    const data = await discountService.createNewDiscount(req.body);
    new SuccessResponse({ metadata: data }).send(res);
  };

  getAllDiscounts = async (req, res, next) => {
    const data = await discountService.getAllDiscounts(req.user.userId);
    new SuccessResponse({ metadata: data }).send(res);
  };
}

module.exports = new DiscountController();
