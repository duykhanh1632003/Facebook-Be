"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "user";
const COLLECTION_NAME = "users";

const workOfUser = new mongoose.Schema({
  nameOfCompany: { type: String, require: true },
  position: { type: String, require: true },
  yearStart: { type: Number },
  yearEnd: { type: Number },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const university = new mongoose.Schema({
  name: { type: String, require: true },
  yearStart: { type: Number },
  yearEnd: { type: Number },
  specialized: { type: String },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const highSchool = new mongoose.Schema({
  name: { type: String, require: true },
  yearStart: { type: Number },
  yearEnd: { type: Number },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const currentCity = new mongoose.Schema({
  name: { type: String },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const oldCity = new mongoose.Schema({
  name: { type: String },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const linkOfSocial = new mongoose.Schema({
  type: {
    type: String,
    enum: ["github", "facebook", "twitter", "instagram", "youtube", "tiktok"],
  },
  link: {
    type: String,
  },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const dateOfBirth = new mongoose.Schema({
  birthDate: {
    type: String, // Sử dụng chuỗi để lưu ngày tháng theo định dạng "16 tháng 3"
    required: true,
  },
  birthYear: {
    type: Number,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["private", "friend", "public"],
    default: "public",
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNumber: { type: String }, // Số điện thoại
    address: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] }, // Giới tính
    avatar: {
      type: String,
      default:
        "https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg",
    }, // Đường dẫn đến hình ảnh đại diện
    savePosts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
      default: [],
    },
    work: [workOfUser],
    universities: [university],
    highSchools: [highSchool],
    currentCity: currentCity,
    oldCity: oldCity,
    socialLinks: [linkOfSocial],
    dateOfBirth: dateOfBirth,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { user: mongoose.model(DOCUMENT_NAME, userSchema) };
