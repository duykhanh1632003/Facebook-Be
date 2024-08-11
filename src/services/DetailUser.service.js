"use strict";
const { BadRequestError } = require("../core/error.response");
const { user } = require("../models/user.model");

class DetailUserService {
  static getBiography = async (userId) => {
    try {
      const biography = await user.findById(userId).select("biography");
      return biography;
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error fetching biography", e);
    }
  };

  static saveBiography = async (userId, biography) => {
    try {
      const updatedUser = await user.findByIdAndUpdate(userId, { biography }, { new: true }).select("biography");
      return updatedUser;
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error saving biography", e);
    }
  };
}

module.exports = DetailUserService;
