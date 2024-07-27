// services/product.service.js
const { product } = require("../models/product.model");

class ProductService {
  async createProduct(data) {
    const newProduct = await product.create(data);
    return newProduct;
  }
}

module.exports = new ProductService();
