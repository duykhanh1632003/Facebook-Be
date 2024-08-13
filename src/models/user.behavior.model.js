"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "userBehavior";
const COLLECTION_NAME = "userBehaviors";

const userBehaviorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        behaviorVector: { type: [Number], require: true }, // Ví dụ: [1, 0, 0, 1, 0.5]
    lastUpdated: { type : Date, default : Date.now }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { userBehavior : mongoose.model(DOCUMENT_NAME, userBehaviorSchema) };
