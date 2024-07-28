const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const data = await ProductService.createProduct(req.body);
      new SuccessResponse({
        message: "Product created successfully",
        data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createAttributes = async (req, res, next) => {
    try {
      const data = req.body;
      const response = await ProductService.createAttributes({
        data,
        userId: req.user.userId,
      });
      new SuccessResponse({
        message: "Attributes created successfully",
        data: response,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductController();
