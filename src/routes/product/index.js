const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.use(authentication);
 
 
 
 

 
router.post("/products/create", asyncHandler(productController.createProduct));



router.get(
  "/get/allProduct",
  asyncHandler(productController.getAllProductOfUser)
);
router.post(
  "/change/status/:product_id",
  asyncHandler(productController.changeStatusProduct)
);

router.delete(
  "/delete/product/:product_id",
  asyncHandler(productController.deleteAProduct)
);

module.exports = router;
