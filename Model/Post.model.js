const mongoose = require('mongoose');

// Định nghĩa Schema cho bài viết
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến mô hình User
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String // Đường dẫn của ảnh
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Tham chiếu đến mô hình User để gắn thẻ bạn bè
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo mô hình Post từ Schema đã định nghĩa
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
