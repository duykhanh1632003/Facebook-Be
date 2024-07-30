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
router.post(
  "/new/attributes",
  asyncHandler(productController.createAttributes)
);

router.delete(
  "/delete/product/:product_id",
  asyncHandler(productController.deleteAProduct)
);
router.get("/get/attributes", asyncHandler(productController.getAttributes));
router.put(
  "/update/attribute/:attributeId",
  asyncHandler(productController.updateAttribute)
);
router.delete(
  "/delete/attribute/:attributeId",
  asyncHandler(productController.deleteAttribute)
);

module.exports = router;
