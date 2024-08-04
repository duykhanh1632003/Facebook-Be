"use strict";
const mongoose = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const { location } = require("../models/location.model");
const { product } = require("../models/product.model");
const { discount } = require("../models/discount.model");

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
    const userLocation = await location.findOne({ user: userObjectId }, "coordinates");

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
      {
        $project: { user: 1 }
      }
    ]);

    const nearbyUserIds = nearbyLocations.map(loc => loc.user);
    const products = await product.find(
      { product_user: { $in: [...nearbyUserIds, userObjectId] },isPublished: true },
      
    );

    const discounts = await discount.find({
      $or: [
        { discount_applies_to: "all" },
        { discount_product_ids: { $in: products.map(p => p._id) } }
      ],
      discount_shopId: { $in: [...nearbyUserIds, userObjectId] },
      discount_is_active: true,
      discount_start_date: { $lte: new Date() },
      discount_end_date: { $gte: new Date() },
    });

    return { products, discounts };
  };
}

module.exports = LocationService;
