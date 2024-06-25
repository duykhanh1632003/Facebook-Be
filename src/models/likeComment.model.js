"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "likeComment";
const COLLECTION_NAME = "likeComments";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = { likeComment: mongoose.model(DOCUMENT_NAME, commentSchema) };
