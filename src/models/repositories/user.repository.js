const { user } = require("../user.model");

class UserRepository {
  async findById(userId, selectFields = "") {
    return await user.findById(userId).select(selectFields).exec();
  }

  async saveUser(userDocument) {
    return await userDocument.save();
  }

  async findByIdAndUpdate(userId, updateFields) {
    return await user
      .findByIdAndUpdate(userId, updateFields, { new: true })
      .exec();
  }
}

module.exports = new UserRepository();
