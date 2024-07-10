"use strict";

const { default: mongoose } = require("mongoose");
const friendList = require("../models/friendList");
const friendRequest = require("../models/friendRequest");
const { user } = require("../models/user.model");
const { BadRequestError } = require("../core/error.response");
const { getUserById } = require("../utils");

class FriendService {
  static getNonFriends = async (userId) => {
    try {
      // Lấy danh sách bạn bè, lời mời đã gửi và nhận song song
      const [friendLists, sentRequests, receivedRequests] = await Promise.all([
        friendList.findOne({ user: userId }).lean().exec(),
        friendRequest.find({ sender: userId }).lean().exec(),
        friendRequest.find({ receiver: userId }).lean().exec(),
      ]);

      const friends = friendLists ? friendLists.friends : [];
      const sentRequestIds = sentRequests.map((request) => request.receiver);
      const receivedRequestIds = receivedRequests.map(
        (request) => request.sender
      );

      // Tập hợp tất cả các ID cần loại trừ
      const excludedIds = [
        ...friends,
        ...sentRequestIds,
        ...receivedRequestIds,
        new mongoose.Types.ObjectId(userId),
      ];

      // Lấy danh sách người dùng không phải bạn bè và không có trong danh sách gửi hoặc nhận lời mời
      const nonFriends = await user
        .find({ _id: { $nin: excludedIds } }, "_id firstName lastName avatar")
        .lean()
        .exec();

      // Tính toán bạn chung cho mỗi người dùng không phải bạn bè
      const nonFriendsWithMutualFriends = await Promise.all(
        nonFriends.map(async (nonFriend) => {
          const nonFriendList = await friendList
            .findOne({ user: nonFriend._id })
            .lean()
            .exec();
          const nonFriendFriends = nonFriendList ? nonFriendList.friends : [];

          const mutualFriends = nonFriendFriends.filter((nonFriendFriend) =>
            friends.includes(nonFriendFriend.toString())
          );

          // Lấy thông tin chi tiết của bạn chung
          const mutualFriendsDetails = await user
            .find(
              { _id: { $in: mutualFriends } },
              "_id firstName lastName avatar"
            )
            .lean()
            .exec();

          return {
            nonFriend: {
              _id: nonFriend._id,
              firstName: nonFriend.firstName,
              lastName: nonFriend.lastName,
              avatar: nonFriend.avatar,
            },
            mutualFriends: mutualFriendsDetails.map((friend) => ({
              _id: friend._id,
              firstName: friend.firstName,
              lastName: friend.lastName,
              avatar: friend.avatar,
            })),
          };
        })
      );

      return nonFriendsWithMutualFriends;
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error fetching non-friends", e);
    }
  };

  static sendFriendRequest = async ({ senderId, receiverId }) => {
    try {
      const existingRequest = await friendRequest
        .findOne({ sender: senderId, receiver: receiverId })
        .exec();
      if (existingRequest) {
        throw new BadRequestError("Friend request already sent");
      }

      const newRequest = await friendRequest.create({
        sender: new mongoose.Types.ObjectId(senderId),
        receiver: new mongoose.Types.ObjectId(receiverId),
      });

      if (!newRequest) {
        throw new BadRequestError("Cannot send new friend request");
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error sending friend request", e.message);
    }
  };

  static cancelFriendRequest = async ({ senderId, receiverId }) => {
    try {
      const existingRequest = await friendRequest
        .findOneAndDelete({ sender: senderId, receiver: receiverId })
        .exec();
      if (!existingRequest) {
        throw new BadRequestError("Friend request not found");
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error cancelling friend request", e.message);
    }
  };

  static getFriendRequests = async (userId) => {
    try {
      // Lấy danh sách yêu cầu kết bạn đã nhận
      const receivedRequests = await friendRequest
        .find({ receiver: userId })
        .lean()
        .exec();
      const receivedRequestIds = receivedRequests.map(
        (request) => request.sender
      );

      // Lấy thông tin chi tiết của người gửi yêu cầu
      const senders = await user
        .find(
          { _id: { $in: receivedRequestIds } },
          "_id firstName lastName avatar"
        )
        .lean()
        .exec();

      // Lấy danh sách bạn bè
      const friendLists = await friendList
        .findOne({ user: userId })
        .lean()
        .exec();
      const friends = friendLists ? friendLists.friends : [];

      // Tính toán bạn chung cho mỗi người gửi yêu cầu
      const requestsWithMutualFriends = await Promise.all(
        senders.map(async (sender) => {
          const senderFriendList = await friendList
            .findOne({ user: sender._id })
            .lean()
            .exec();
          const senderFriends = senderFriendList
            ? senderFriendList.friends
            : [];

          const mutualFriends = senderFriends.filter((senderFriend) =>
            friends.includes(senderFriend.toString())
          );

          // Lấy thông tin chi tiết của bạn chung
          const mutualFriendsDetails = await user
            .find(
              { _id: { $in: mutualFriends } },
              "_id firstName lastName avatar"
            )
            .lean()
            .exec();

          return {
            sender: {
              _id: sender._id,
              firstName: sender.firstName,
              lastName: sender.lastName,
              avatar: sender.avatar,
            },
            mutualFriends: mutualFriendsDetails.map((friend) => ({
              _id: friend._id,
              firstName: friend.firstName,
              lastName: friend.lastName,
              avatar: friend.avatar,
            })),
          };
        })
      );

      return requestsWithMutualFriends;
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error fetching friend requests", e);
    }
  };

  static acceptFriendRequest = async ({ userId, senderId }) => {
    try {
      // Xóa lời mời kết bạn
      await friendRequest
        .deleteOne({ sender: senderId, receiver: userId })
        .exec();

      // Thêm bạn vào danh sách bạn bè của người nhận
      await friendList
        .updateOne(
          { user: userId },
          { $push: { friends: senderId } },
          { upsert: true }
        )
        .exec();

      // Thêm bạn vào danh sách bạn bè của người gửi
      await friendList
        .updateOne(
          { user: senderId },
          { $push: { friends: userId } },
          { upsert: true }
        )
        .exec();

      return { message: "Friend request accepted" };
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error accepting friend request", e);
    }
  };

  static handleGetNumberOfFr = async (userId) => {
    try {
      // Find the friend list for the given user
      const friendFound = await friendList
        .findOne({ user: userId })
        .populate({
          path: "friends",
          select: "avatar",
        })
        .lean()
        .exec();

      // If no friend list is found, return 0 friends
      if (!friendFound) {
        return { numberOfFriends: 0, friends: [] };
      }

      const frNumber = friendFound.friends.length;
      const first8Friends = friendFound.friends;

      // Return the number of friends and the avatars of the first 8 friends
      return {
        numberOfFriends: frNumber,
        friends: first8Friends.map((friend) => ({
          _id: friend._id,
          avatar: friend.avatar,
        })),
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestError("Error fetching number of friends", e.message);
    }
  };

  static getDetailOfAUser = async ({ userId, idAnother }) => {
    try {
      // Fetch user details
      const userDetails = await getUserById(idAnother);
      if (!userDetails) {
        throw new BadRequestError("User not found");
      }

      console.log("Check user", { userId, idAnother });
      const idObject = new mongoose.Types.ObjectId(idAnother);

      // Fetch friend list of the user
      const friendLists = await friendList
        .findOne({ user: userId })
        .lean()
        .exec();
      const friends = friendLists
        ? friendLists.friends.map((friend) => friend.toString())
        : [];
      console.log("check fe", friends);

      // Determine friend status
      let friendStatus = "none";
      if (friends.includes(idObject.toString())) {
        friendStatus = "friends";
      }

      // Check for sent friend request
      const sentRequest = await friendRequest
        .findOne({ sender: userId, receiver: idAnother })
        .exec();
      if (sentRequest) {
        friendStatus = "sent";
      }

      // Check for received friend request
      const receivedRequest = await friendRequest
        .findOne({ sender: idAnother, receiver: userId })
        .exec();
      if (receivedRequest) {
        friendStatus = "pending";
      }

      console.log("check status", friendStatus);

      return {
        userDetails,
        friendStatus,
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestError(
        "Error fetching user details and friend status",
        e.message
      );
    }
  };
}

module.exports = FriendService;
