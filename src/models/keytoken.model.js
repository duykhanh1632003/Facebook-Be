"use strict";
const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "key";
const COLLECTION_NAME = "keys";

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = {keyToken :mongoose.model(DOCUMENT_NAME, keyTokenSchema)}
