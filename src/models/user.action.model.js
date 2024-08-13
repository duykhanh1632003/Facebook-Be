"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "userAction";
const COLLECTION_NAME = "userActions";

const userActionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        actionType: {
            type: String,
            enum: ['view', 'like', 'comment', 'share', 'click'],
            require: true
        },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
        timestamps: { type: Date, default: Date.now },
        metadata: { type: Map, of: String },// Thông tin bổ sung như thời gian xem
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { userAction: mongoose.model(DOCUMENT_NAME, userActionSchema) };
