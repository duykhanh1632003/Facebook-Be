"use strict"

const { SuccessResponse } = require("../core/success.response");
const SearchService = require("../services/search.service");

class SearchController{
     //them nguoi dung vao search
  searchHistoryOfUser = async (req, res, next) => {
    const { userId, searchedUserId } = req.body;
    const result = await SearchService.searchHistoryOfUser({
      userId,
      searchedUserId,
    });
    new SuccessResponse({
      message: "Search history updated successfully",
      metadata: result,
    }).send(res);
  };


  //lay data da search
  getSearchHistoryOfUser = async (req, res, next) => {
    const { userId } = req.params;
    const result = await SearchService.getSearchHistoryOfUser(userId);
    new SuccessResponse({
      message: "Get search history successfully",
      metadata: result,
    }).send(res);
    };
    
    //tim kiem realtime
  searchUser = async (req, res, next) => {
    const { query } = req.query;
    const result = await SearchService.searchUser({query,currentUserId:req.user.userId});
    new SuccessResponse({
      message: "Search user successfully",
      metadata: result,
    }).send(res);
  };

  //loai bo user ra khoi search
  removeUserFromSearch = async (req, res, next) => {
    const { userId } = req.body;
    const result = await SearchService.removeUserFromSearch({
      user: req.user.userId,
      searchedUsers: userId,
    });
    new SuccessResponse({
      message: "Remove user successfully",
    }).send(res);
  };
}

module.exports = new SearchController()