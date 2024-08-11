"use strict";

const { user } = require("../models/user.model");
const friendList = require("../models/friendList");

const getMutualFriends = async (userId, otherUserId) => {
  // Lấy danh sách bạn bè của người dùng
  const [userFriendList, otherUserFriendList] = await Promise.all([
    friendList.findOne({ user: userId }).lean().exec(),
    friendList.findOne({ user: otherUserId }).lean().exec(),
  ]);

  const userFriends = userFriendList ? userFriendList.friends : [];
  const otherUserFriends = otherUserFriendList
    ? otherUserFriendList.friends
    : [];

  // Tìm bạn chung
  const mutualFriends = userFriends.map(friendId => friendId.toString()).filter((friend) =>
    otherUserFriends.includes(friend.toString())
  );

  // Lấy thông tin chi tiết của bạn chung
  const mutualFriendsDetails = await user
    .find({ _id: { $in: mutualFriends } }, "_id firstName lastName avatar")
    .lean()
    .exec();

  return mutualFriendsDetails.map((friend) => ({
    _id: friend._id,
    firstName: friend.firstName,
    lastName: friend.lastName,
    avatar: friend.avatar,
  }));
};

module.exports = { getMutualFriends };
