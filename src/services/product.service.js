const { product } = require("../models/product.model");

class ProductService {
  async createProduct(data) {
    const { attributes, combinations } = data;

    // Ensure combinations and attributes are combined correctly
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

    // Create new product
    const newProduct = await product.create(data);
    return newProduct;
  }
}

module.exports = new ProductService();
