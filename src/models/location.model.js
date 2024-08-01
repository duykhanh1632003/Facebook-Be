"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "location";
const COLLECTION_NAME = "locations";

const locationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    location: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },  
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { location: mongoose.model(DOCUMENT_NAME, locationSchema) };
