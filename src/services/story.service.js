"use strict";

const { BadRequestError } = require("../core/error.response");
const client = require("../db/init.redis");
const friendList = require("../models/friendList");
const { story } = require("../models/story.model");

class StoryService {
  static postStoryImage = async ({ userId, imageUrl }) => {
    const newStory = await story.create({
      author: userId,
      type: "image",
      image: imageUrl,
    });
    if (!newStory) {
      throw new BadRequestError("Cannot create story image");
    }
    return newStory;
  };

  static postStoryText = async ({ userId, text, font, background }) => {
    try {
      const newStory = await story.create({
        author: userId,
        type: "text",
        text,
        font,
        backGround: background,
      });
      if (!newStory) {
        throw new BadRequestError("Cannot create story text");
      }
      return;
    } catch (error) {
      console.log(error)
    }
  };

  static getStories = async (userId) => {
    try {
      const cacheKey = `story:${userId}`;
      console.log("Attempting to get cached stories for key:", cacheKey);

      const cachedStories = await client.get(cacheKey);
      if (cachedStories) {
        console.log("Cached stories found:", cachedStories);
        return JSON.parse(cachedStories);
      } else {
        console.log("No cached stories found for key:", cacheKey);
      }

      // Fetch friend's list
      const friendsList = await friendList
        .findOne({ user: userId })
        .populate("friends", "id firstName lastName avatar");

      if (!friendsList) {
        console.log("No friends list found for user:", userId);
        return [];
      }

      // Fetch stories
      const friendIds = friendsList.friends.map((f) => f._id);
      const stories = await story
        .find({
          author: { $in: [userId, ...friendIds] },
          action: true,
        })
        .populate("author", "id firstName lastName avatar");

      console.log("Fetched stories:", stories);

      // Format the stories to the required structure
      const storiesByUser = {};

      stories.forEach((story) => {
        const authorId = story.author._id.toString();
        if (!storiesByUser[authorId]) {
          storiesByUser[authorId] = {
            userId: authorId,
            userName: `${story.author.firstName} ${story.author.lastName}`,
            avatar: story.author.avatar,
            stories: [],
          };
        }
        storiesByUser[authorId].stories.push({
          storyId: story._id.toString(),
          type: story.type,
          image: story.image,
          text: story.text,
          backGround: story.backGround,
          font: story.font,
          createdAt: story.createdAt,
        });
      });

      const formattedStories = Object.values(storiesByUser);

      // Cache the formatted stories
      await client.setEx(cacheKey, 86400, JSON.stringify(formattedStories)); // Cache for 24 hours
      console.log("Stories cached successfully with key:", cacheKey);

      return formattedStories;
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw error;
    }
  };
}

module.exports = StoryService;
