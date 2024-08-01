const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const locationController = require("../../controllers/location.controller");
const router = express.Router();

router.use(authentication);
router.post(
  "/save-location",
  asyncHandler(locationController.createNewLocation)
);


module.exports = router;
