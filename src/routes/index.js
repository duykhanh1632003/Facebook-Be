"use strict";
const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));
router.use("/v1/api", require("./user"));
router.use("/v1/api", require("./post"));
router.use("/v1/api", require("./friend"));
router.use("/v1/api",require("./conversation"));
router.use("/v1/api",require('./message'));

module.exports = router;
