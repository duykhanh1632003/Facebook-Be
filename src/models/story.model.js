"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "story";
const COLLECTION_NAME = "stories";

const storySchema = new mongoose.Schema(
  {
    image: { type: String },
    type: {
      type: String,
      default: "image",
      enum: ["text", "image"],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    feeling: [{ type: mongoose.Schema.Types.ObjectId, ref: "feelingPost" }],
    font: { type: Number },
    backGround: { type: Number },
    text: { type: String },
    action: { type: Boolean, default: "true" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { story: mongoose.model(DOCUMENT_NAME, storySchema) };
