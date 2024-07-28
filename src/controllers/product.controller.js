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

  getAttributes = async (req, res, next) => {
    try {
      const response = await ProductService.getAttributes({
        userId: req.user.userId,
      });
      console.log("Check res", response);
      new SuccessResponse({
        message: "Get attributes successfully",
        metadata: response,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateAttribute = async (req, res, next) => {
    try {
      const { attributeId, newValue } = req.body;
      const response = await ProductService.updateAttributes({
        userId: req.user.userId,
        attributeId,
        newValue,
      });
      new SuccessResponse({
        message: "Attribute updated successfully",
        data: response,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  deleteAttribute = async (req, res, next) => {
    try {
      const { attributeId } = req.params;
      const response = await ProductService.deleteAttribute({
        userId: req.user.userId,
        attributeId,
      });
      new SuccessResponse({
        message: "Attribute deleted successfully",
        data: response,
      }).send(res);
    } catch (error) {
      next(error);
    } 
  };
}

module.exports = new ProductController();
