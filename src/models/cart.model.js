"use strict";
const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";
const mongoose = require("mongoose"); // Erase if already required

const cartSchema = mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: { type: Array, require: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, require: true },
  },
  {
    collation: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);
module.exports = { cart: mongoose.model(DOCUMENT_NAME, cartSchema) };
