"use strict";
const DOCUMENT_NAME = "discount";
const COLLECTION_NAME = "discounts";
const mongoose = require("mongoose"); // Erase if already required

const discountSchema = new mongoose.Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, require: true },
    discount_code: { type: String, require: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_use: { type: Number, require: true },
    discount_uses_count: { type: Number, require: true },
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_shopId: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
    discount_is_active: { type: Boolean, default: true },

    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Tạo mô hình từ schema đã định nghĩa và xuất nó
module.exports = { discount: mongoose.model(DOCUMENT_NAME, discountSchema) };
