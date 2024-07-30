const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const redisController = require("../../controllers/redis.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);
router.post("/book", asyncHandler(redisController.handlePostBook));
router.post("/book/get", asyncHandler(redisController.handleGetBook));

module.exports = router;
