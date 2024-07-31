"use strict";

const { BadRequestError } = require("../core/error.response");

class DiscountService {
  static acceptFriendRequest = async ({ userId, senderId }) => {
    try {
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error accepting friend request", e);
    }
  };
}

module.exports = new DiscountService();
