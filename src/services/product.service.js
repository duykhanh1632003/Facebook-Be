const { BadRequestError } = require("../core/error.response");
const { variation } = require("../models/variation.model");
const { product } = require("../models/product.model");
const { default: mongoose } = require("mongoose");

class ProductService {
  static async createProduct(data) {
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

  static async getAllProductOfUser(userId) {
    try {
      console.log("Check user", userId);
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const products = await product
        .find({ product_user: userObjectId })
        .select("+isDraft +isPublished");
      console.log("Check products", products);
      return products.length > 0 ? products : [];
    } catch (e) {
      throw new Error("Error getting products: " + e.message);
    }
  }

  static async deleteAProduct(product_id) {
    try {
      const deletedProduct = await product.findByIdAndDelete(product_id);
      if (!deletedProduct) {
        throw new BadRequestError("Cannot delete a product");
      }
      return deletedProduct;
    } catch (error) {
      throw new Error("Error delete product: " + error.message);
    }
  }

  static async changeStatusProduct({ product_id }) {
    try {
      const productDoc = await product.findByIdAndUpdate(
        product_id,
        [
          {
            $set: {
              isDraft: { $not: "$isDraft" },
              isPublished: { $not: "$isPublished" },
            },
          },
        ],
        { new: true, select: "+isDraft +isPublished" } // This option returns the updated document
      );
      if (!productDoc) {
        throw new BadRequestError("Product not found");
      }

      return productDoc;
    } catch (error) {
      throw new Error("Error changing status product: " + error.message);
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
