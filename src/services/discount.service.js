"use strict";
const { BadRequestError } = require("../core/error.response");
const { discount } = require("../models/discout.model");

class DiscountService {
  static createNewDiscount = async (discountData) => {
    console.log("Check discountData", discountData);
    try {
      const newDiscount = await discount.create(discountData);
      return newDiscount;
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error creating discount", e);
    }
  };

  static getAllDiscounts = async (userId) => {
    try {
      const discounts = await discount.find({ discount_shopId: userId });
      return discounts;
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error fetching discounts", e);
    }
  };
}

module.exports = DiscountService;
