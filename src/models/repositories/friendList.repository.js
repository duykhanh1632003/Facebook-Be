const friendList = require("../friendList");

class FriendListRepository {
  async findByUserId(userId) {
    return await friendList.find({ user: userId }).exec();
  }

  async saveFriendList(friendListDocument) {
    return await friendListDocument.save();
  }

  async findByIdAndUpdate(friendListId, updateFields) {
    return await friendList
      .findByIdAndUpdate(friendListId, updateFields, { new: true })
      .exec();
  }
}

module.exports = new FriendListRepository();
