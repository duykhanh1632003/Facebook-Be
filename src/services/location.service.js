"use strict";
const mongoose = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const { location } = require("../models/location.model");
const { product } = require("../models/product.model");

class LocationService {
  static createNewLocation = async ({ data, userId }) => {
    const { latitude, longitude } = data;

    const res = await location.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          location: "Point",
          coordinates: [longitude, latitude], // Order should be longitude, latitude
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!res) {
      throw new BadRequestError("Cannot create or update location");
    }
    return res;
  };

  static findProductNearUser = async ({ userId, maxDistance = 10000 }) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userLocation = await location.findOne({ user: userObjectId });

    if (!userLocation) {
      throw new BadRequestError("User location not found");
    }

    const nearbyLocations = await location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: userLocation.coordinates },
          distanceField: "dist.calculated",
          maxDistance: maxDistance,
          spherical: true,
        },
      },
    ]);
    console.log("chec nearbyLocations",nearbyLocations)

    const nearbyUserIds = nearbyLocations.map(loc => loc.user);
    console.log("nearbyUserIds",nearbyUserIds )
    const products = await product.find({ product_user: { $in: [...nearbyUserIds, userObjectId] } });

    return products;
  };
}

module.exports = LocationService;
