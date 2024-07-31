/api/get / allDiscount

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.use(authentication);


module.exports = router;
