const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.use(authentication);
router.post(
  "/post/new/discount",
  asyncHandler(discountController.createNewDiscount)
);
router.get(
  "/get/allDiscount",
  asyncHandler(discountController.getAllDiscounts)
);

module.exports = router;
