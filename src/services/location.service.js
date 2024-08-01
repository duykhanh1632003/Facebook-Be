"use strict";
const { BadRequestError } = require("../core/error.response");
const { location } = require("../models/location.model");

class LocationService {
  static createNewLocation = async ({ data, userId }) => {
    const { latitude, longitude } = data;
    const res = await location.findByIdAndUpdate(
      userId,
      {
        $set: {
          location: "Point",
          coordinates: [latitude, longitude],
        },
      },
      { upsert: true, new: true }
    );
    if (!res) {
      throw new BadRequestError("Cannot create new location");
    }
    return res;
  };

  static findProductNearUser = (userId) => {};
}

module.exports = LocationService;
