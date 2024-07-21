const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const TinderController = require("../../controllers/tinder.controller");
const router = express.Router();

router.use(authentication);
router.post(
  "/tinder/create/user",
  asyncHandler(TinderController.createUserTinder)
);

module.exports = router;
