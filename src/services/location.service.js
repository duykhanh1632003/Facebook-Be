"use strict";
const { BadRequestError } = require("../core/error.response");
const { location } = require("../models/location.model");
const { product } = require("../models/product.model");

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

  static findProductNearUser = async ({ userId , maxDistance }) => {
    const userLocation = await location.findOne({ user: userId });
    if (!userLocation) {
      throw new BadRequestError("User location not found");
    }
    const nearByLocations = await location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: userLocation.coordinates },
          distanceField: "dist.calculated",
          maxDistance: maxDistance,
          spherical: true,
        }
      }
      
    ])
    const nearbyUserIds = nearByLocations.map(loc => loc.user);
    const products = await product.find({ product_user: { $in: [...nearbyUserIds, userId] } });

    return products;

  };
}

module.exports = LocationService;
