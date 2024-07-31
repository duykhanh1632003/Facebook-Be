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

  getAllProductOfUser = async (req, res, next) => {
    try {
      const data = await ProductService.getAllProductOfUser(req.user.userId);
      new SuccessResponse({
        message: "Product created successfully",
        metadata: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  deleteAProduct = async (req, res, next) => {
    try {
      const { product_id } = req.params;
      await ProductService.deleteAProduct(product_id);
      new SuccessResponse({
        message: "delete product successfully",
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  changeStatusProduct = async (req, res, next) => {
    try {
      const { product_id } = req.params;
      const data = await ProductService.changeStatusProduct({ product_id });
      new SuccessResponse({
        message: "Product created successfully",
        metadata: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  
}

module.exports = new ProductController();
