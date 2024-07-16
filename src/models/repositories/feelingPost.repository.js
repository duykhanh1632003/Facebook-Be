const { feelingPost } = require("../feelingPost.model");

class FeelingPostRepository {
  async findOne(query) {
    return await feelingPost.findOne(query).exec();
  }

  async findById(feelingPostId) {
    return await feelingPost.findById(feelingPostId).exec();
  }

  async create(feelingPostData) {
    return await feelingPost.create(feelingPostData);
  }

  async findByIdAndDelete(feelingPostId) {
    return await feelingPost.findByIdAndDelete(feelingPostId).exec();
  }

  async save(feelingPostDocument) {
    return await feelingPostDocument.save();
  }

  async findLikesByIds(likeIds) {
    return await feelingPost
      .find({ _id: { $in: likeIds } })
      .populate("userId", "firstName lastName avatar")
      .exec();
  }
}

module.exports = new FeelingPostRepository();
