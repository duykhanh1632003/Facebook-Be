"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Add this line to import Schema from mongoose

const DOCUMENT_NAME = "feelingPost";
const COLLECTION_NAME = "feelingPosts";

const feelingPostSchema = new Schema( // Use Schema instead of mongoose.Schema
  {
    type: {
      type: String,
      required: true,
      enum: ["like", "favourite", "smile", "wow", "cry", "angry"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  feelingPost: mongoose.model(DOCUMENT_NAME, feelingPostSchema),
};
