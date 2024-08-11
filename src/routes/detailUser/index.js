const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const detailUserController = require("../../controllers/detailUser.controller");
const router = express.Router();

router.use(authentication);
router.get(
  "/get/biography/:userId",
  asyncHandler(detailUserController.getBiography)
);
router.post(
  "/save/biography/:userId",
  asyncHandler(detailUserController.saveBiography)
);

module.exports = router;
