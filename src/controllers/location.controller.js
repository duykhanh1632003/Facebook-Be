"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const LocationService = require("../services/location.service.js");

class LocationController {
  createNewLocation = async (req, res, next) => {
    const data = await LocationService.createNewLocation({
      data: req.body,
      userId: req.user.userId,
    });
    new SuccessResponse({ metadata: data }).send(res);
  };
}

module.exports = new LocationController();
