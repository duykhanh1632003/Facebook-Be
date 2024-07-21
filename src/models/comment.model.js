"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Add this line to import Schema from mongoose

  const DOCUMENT_NAME = "comment";
  const COLLECTION_NAME = "comments";

const commentSchema = new Schema( // Use Schema instead of mongoose.Schema
  {
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    postId: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
      ref: "post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
      ref: "user",
      required: true,
    },
    parentId: { type: Schema.Types.ObjectId, ref: "comment" }, // Use Schema.Types.ObjectId
    childrenId: [{ type: Schema.Types.ObjectId, ref: "comment" }], // Use Schema.Types.ObjectId
    likes: [{ type: Schema.Types.ObjectId, ref: "likeComment" }], // Use Schema.Types.ObjectId
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { comment: mongoose.model(DOCUMENT_NAME, commentSchema) };
