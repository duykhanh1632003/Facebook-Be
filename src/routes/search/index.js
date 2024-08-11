"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const searchController = require("../../controllers/search.controller");
const router = express.Router();

router.use(authentication);
router.post(
    "/search-history",
    asyncHandler(searchController.searchHistoryOfUser)
  );
router.get(
"/search-history/:userId",
asyncHandler(searchController.getSearchHistoryOfUser)
);
router.get("/search/users", asyncHandler(searchController.searchUser));
router.post("/remove/user/search",asyncHandler(searchController.removeUserFromSearch))
module.exports = router;
