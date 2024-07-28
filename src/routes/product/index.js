// routes/product.route.js
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.use(authentication);

router.post("/products/create", asyncHandler(productController.createProduct));

module.exports = router;
