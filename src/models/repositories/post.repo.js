const { post } = require("../post.model");

class PostRepository {
  async createPost({ content, image, author, likedPost, comments, share }) {
    return await post.create({
      content,
      image,
      author,
      likedPost,
      comments,
      share,
    });
  }

  async updateLikes(postId, likeId, action) {
    const update =
      action === "push"
        ? { $push: { likes: likeId } }
        : { $pull: { likes: likeId } };
    return await post.updateOne({ _id: postId }, update);
  }

  async findById(postId) {
    return await post.findById(postId);
  }

  async findPostsByAuthors(authors, skip, limit) {
    return await post
      .find({ author: { $in: authors } })
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findDetailById(postId) {
    return await post
      .findById(postId)
      .populate("author", "firstName lastName avatar")
      .populate({
        path: "likes",
        populate: {
          path: "userId",
          select: "firstName lastName avatar _id",
        },
      })
      .exec();
  }

  async findImagesByUserId(userId) {
    return await post.find({ author: userId }, { image: 1, _id: 1 }).exec();
  }
}

module.exports = new PostRepository();
