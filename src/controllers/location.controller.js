"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const LocationService = require("../services/location.service.js");

class LocationController {
  createNewLocation = async (req, res, next) => {
    try {
      const data = await LocationService.createNewLocation({
        data: req.body,
        userId: req.user.userId,
      });
      new SuccessResponse({ metadata: data }).send(res);
    } catch (error) {
      next(error);
    }
  };

  findProductNearUser = async (req, res, next) => {
    try {
      const { maxDistance } = req.params;

      const data = await LocationService.findProductNearUser({
        maxDistance: Number(maxDistance),
        userId: req.user.userId,
      });
      new SuccessResponse({ metadata: data }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new LocationController();
