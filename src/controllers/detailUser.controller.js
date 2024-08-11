"use strict";
const { SuccessResponse } = require("../core/success.response.js");
const DetailUserService = require("../services/DetailUser.service.js");

class DetailUserController {
  getBiography = async (req, res, next) => {
    const { userId } = req.params;
    const data = await DetailUserService.getBiography(userId);
    new SuccessResponse({ metadata: data }).send(res);
  };

    saveBiography = async (req, res, next) => {
    const { userId } = req.params;
    const {  biography } = req.body;
    const data = await DetailUserService.saveBiography(userId, biography);
    new SuccessResponse({ metadata: data }).send(res);
  };
}

module.exports = new DetailUserController();
