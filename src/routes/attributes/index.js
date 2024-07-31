const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const attributesController = require("../../controllers/attributes.controller");
const router = express.Router();

router.use(authentication);

router.post(
  "/new/attributes",
  asyncHandler(attributesController.createAttributes)
);
router.get("/get/attributes", asyncHandler(attributesController.getAttributes));
router.put(
  "/update/attribute/:attributeId",
  asyncHandler(attributesController.updateAttribute)
);
router.delete(
  "/delete/attribute/:attributeId",
  asyncHandler(attributesController.deleteAttribute)
);

module.exports = router;
