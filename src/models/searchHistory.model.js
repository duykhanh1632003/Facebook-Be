"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "SearchHistory";
const COLLECTION_NAME = "searchhistories";

const searchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    searchedUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        searchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, searchHistorySchema);
