"use strict";

const { BadRequestError } = require("../core/error.response");
const { variation } = require("../models/variation.model");

class AttributesService {
  static createAttributes = async ({ data, userId }) => {
    try {
      const attribute = {
        category: data.attributeName,
        value: data.attributeValue,
      };

      const response = await variation.findOneAndUpdate(
        { user: userId },
        { $push: { attributes: attribute } },
        { new: true, upsert: true }
      );
      return response;
    } catch (error) {
      throw new Error("Error creating attributes: " + error.message);
    }
  };

  static getAttributes = async ({ userId }) => {
    const response = await variation.findOne({ user: userId });
    if (!response) {
      throw new BadRequestError("Cannot get attributes");
    }
    return response.attributes;
  };

  static updateAttributes = async ({ userId, attributeId, newValue }) => {
    const vari = await variation.findOneAndUpdate(
      { user: userId, "attributes._id": attributeId },
      { $set: { "attributes.$.value": newValue } },
      { new: true }
    );
    if (!vari) {
      throw new BadRequestError("Attribute not found");
    }
    return vari;
  };

  static deleteAttribute = async ({ userId, attributeId }) => {
    const deleteVariation = await variation.findOneAndUpdate(
      { user: userId },
      { $pull: { attributes: { _id: attributeId } } },
      { new: true }
    );
    if (!deleteVariation) {
      throw new BadRequestError("Attribute not found");
    }
    return deleteVariation;
  };
}

module.exports = AttributesService;
