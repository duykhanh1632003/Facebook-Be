"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DOCUMENT_NAME = "feelingStory";
const COLLECTION_NAME = "feelingStories";

const feelingStorySchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["like", "favourite", "smile", "wow", "cry", "angry"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    comment: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  feelingStory: mongoose.model(DOCUMENT_NAME, feelingStorySchema),
};
