const clientEs = require("../db/init.es");

class ElasticsearchService {
  static async indexPost(post) {
    try {
      await clientEs.index({
        index: "posts",
        id: post._id.toString(),
        body: post,
      });
    } catch (e) {
      console.error("Error indexing post:", e);
    }
  }
  static async searchPosts(query) {
    try {
      const { body } = await clientEs.search({
        index: "posts",
        body: {
          query: {
            multi_match: {
              query,
              fields: ["content", "author"],
            },
          },
        },
      });
      return body.hits.hits;
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  }
}
module.exports = ElasticsearchService;
