"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "user";
const COLLECTION_NAME = "users";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: String }, // Số điện thoại
    address: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] }, // Giới tính
    dateOfBirth: { type: Date }, // Ngày sinh
    avatar: {
      type: String,
      default:
        "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg",
    }, // Đường dẫn đến hình ảnh đại diện
    savePosts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = { user: mongoose.model(DOCUMENT_NAME, userSchema) };
