"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "postVideo";
const COLLECTION_NAME = "postVideos";

const postVideoSchema = new mongoose.Schema(
  {
    content: { type: String },
    videoUrl: { type: String },
    permission: {
      type: String,
      default: "public",
      enum: ["public", "friend", "private"],
    },
    view: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "feelingPost" }],
    share: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { postVideo: mongoose.model(DOCUMENT_NAME, postVideoSchema) };
