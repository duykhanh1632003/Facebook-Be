"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const accessController = require("../../controllers/access.controller");
const router = express.Router();

router.post("/user/login", asyncHandler(accessController.login));
router.post("/user/signup", asyncHandler(accessController.signup));
router.post(
  "/user/handleRefreshToken",
  asyncHandler(accessController.handlerRefreshToken)
);
router.post(
  "/send_recovery_email",
  asyncHandler(accessController.handleGetPassWordForgot)
);
router.get("/get/email/user", accessController.getInfUser);
router.post(
  "/user/changePassword",
  asyncHandler(accessController.changePassword)
);
router.use(authentication);
router.post(
  "/user/update/avatar",
  asyncHandler(accessController.createNewAvatar)
);
router.post("/user/logout", asyncHandler(accessController.logout));
router.post(
  "/user/refreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
