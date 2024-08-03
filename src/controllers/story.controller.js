"use strict";
const {  SuccessResponse } = require("../core/success.response.js");
const StoryService = require("../services/story.service.js");

class StoryController {
  postStoryImage = async (req, res) => {
     await StoryService.postStoryImage(req.body);
    new SuccessResponse({ message: "create story success" }).send(res);
  };

  postStoryText = async (req, res) => {
     await StoryService.postStoryText(req.body);
    new SuccessResponse({ message: "create story success" }).send(res);
  };
  getStories = async (req, res) => {
    const data = await StoryService.getStories(req.user.userId);
    new SuccessResponse({
      metadata: data,
      message: "Fetch stories success",
    }).send(res);
  };
}

module.exports = new StoryController();
