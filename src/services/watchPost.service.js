"use strict";

const { postVideo } = require("../models/post.video.model");
const friendListRepository = require("../models/repositories/friendList.repository");

class WatchPostService {
  static handleGetAllPosts = async ({ userId }) => {
    const friendLists = await friendListRepository.findByUserId(userId);
    const friendIds = friendLists.reduce(
      (acc, fl) => acc.concat(fl.friends),
      []
    );
    friendIds.push(userId);

    const posts = await postVideo
      .find({ author: { $in: friendIds } })
      .populate("author", "firstName lastName avatar")
      .exec();
    return posts;
  };
}

module.exports = WatchPostService;
