"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "variation";
const COLLECTION_NAME = "variations";

const attributeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Thêm dòng này để có _id
  category: { type: String, required: true },
  value: { type: String, required: true },
});

const variationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    attributes: [attributeSchema],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { variation: mongoose.model(DOCUMENT_NAME, variationSchema) };
