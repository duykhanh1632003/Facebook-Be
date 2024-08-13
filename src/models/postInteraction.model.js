const mongoose = require('mongoose');

const postInteractionSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  interactionScore: { type: Number, default: 0 }, // Tính toán điểm tương tác
  lastInteracted: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PostInteraction', postInteractionSchema);
