  "use strict";
  const mongoose = require("mongoose");
  const { BadRequestError } = require("../core/error.response");
  const { location } = require("../models/location.model");
  const { product } = require("../models/product.model");
const { discount } = require("../models/discout.model");

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
        { product_user: { $in: [...nearbyUserIds, userObjectId] } },
        "_id product_user product_variations"
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
      const updatedProducts = products.map(product => {
        let applicableDiscounts = discounts.filter(disc =>
          disc.discount_applies_to === "all" ||
          disc.discount_product_ids.includes(product._id)
        );

        product.product_variations = product.product_variations.map(variation => {
          let originalPrice = variation.price;
          let maxDiscount = 0;
  
          applicableDiscounts.forEach(disc => {
            if (originalPrice >= disc.discount_min_order_value) {
              let discountValue = 0;
              if (disc.discount_type === "fixed_amount") {
                discountValue = disc.discount_value;
              } else if (disc.discount_type === "percentage") {
                discountValue = (originalPrice * disc.discount_value) / 100;
              }
              if (discountValue > maxDiscount) {
                maxDiscount = discountValue;
              }
            }
          });
  
          let discountedPrice = originalPrice - maxDiscount;

          return {
            ...variation,
            price: originalPrice,
            discountedPrice: discountedPrice > 0 ? discountedPrice : 0
          };
        });

        return product;
      });
  
      return updatedProducts;
    };
  }
  
  
  module.exports = LocationService;
