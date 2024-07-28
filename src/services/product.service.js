const { product } = require("../models/product.model");
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

  async createAttributes({ data, userId }) {
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
}

module.exports = new ProductService();
