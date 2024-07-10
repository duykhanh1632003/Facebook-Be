const buildNestedComments = (comments) => {
  const commentsById = {};

  comments.forEach((comment) => {
    commentsById[comment._id] = { ...comment.toObject(), children: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      commentsById[comment.parentId].children.push(commentsById[comment._id]);
    }
  });
  return Object.values(commentsById).filter((comment) => !comment.parentId);
};
module.exports = { buildNestedComments };
