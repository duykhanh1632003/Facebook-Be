"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const redisController = require("../../controllers/redis.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);
router.post("/v1/api/book/", asyncHandler(redisController.handlePostBook));

module.exports = router;
