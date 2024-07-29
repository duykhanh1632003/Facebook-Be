"use strict";
const DOCUMENT_NAME = "discount";
const COLLECTION_NAME = "discounts";
const mongoose = require("mongoose"); // Erase if already required

const discountSchema = new mongoose.Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String },
    discount_type: {
      type: String,
      enum: ["fixed_amount", "percentage"],
      required: true,
    },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_use: { type: Number, required: true },
    discount_uses_count: { type: Number, default: 0 },
    discount_users_used: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    discount_max_uses_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    discount_is_active: { type: Boolean, default: true },
    discount_status: {
      type: String,
      enum: ["active", "draft", "scheduled", "expired"],
      default: "draft",
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "product",
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { discount: mongoose.model(DOCUMENT_NAME, discountSchema) };
