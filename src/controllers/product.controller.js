// controllers/product.controller.js
const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    const data = await ProductService.createProduct(req.body);
    new SuccessResponse({ message: "Product created successfully", data }).send(
      res
    );
  };
}

module.exports = new ProductController();
