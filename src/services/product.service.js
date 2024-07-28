const { BadRequestError } = require("../core/error.response");
const { variation } = require("../models/variation.model");

class ProductService {
  async createProduct(data) {
    try {
      const { attributes, combinations } = data;

      if (attributes && combinations) {
        data.product_variations = combinations.map((combination, index) => ({
          attributes: attributes.map((attr) => ({
            category: attr.category,
            value: attr.value.split(",")[index % attr.value.split(",").length],
          })),
          price: parseFloat(combination.price),
          quantity: parseInt(combination.quantity, 10),
        }));
      }

      const newProduct = await product.create(data);
      return newProduct;
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  }
  static async createAttributes({ data, userId }) {
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
  }

  static async getAttributes({ userId }) {
    const response = await variation.findOne({ user: userId });
    if (!response) {
      throw new BadRequestError("Cannot get attributes");
    }
    return response.attributes;
  }

  static async updateAttributes({ userId, attributeId, newValue }) {
    const vari = await variation.findOneAndUpdate(
      { user: userId, "attributes._id": attributeId },
      { $set: { "attributes.$.value": newValue } },
      { new: true }
    );
    return vari;
  }

  static async deleteAttribute({ userId, attributeId }) {
    const deleteVariation = await variation.findOneAndUpdate(
      { user: userId },
      { $pull: { attributes: { _id: attributeId } } },
      { new: true }
    );
    return deleteVariation;
  }
}

module.exports = ProductService;
