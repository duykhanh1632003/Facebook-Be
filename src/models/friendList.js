"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "friendList";
const COLLECTION_NAME = "friendlists";

const friendListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, friendListSchema);
