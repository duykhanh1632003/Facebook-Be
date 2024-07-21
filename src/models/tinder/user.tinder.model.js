const mongoose = require("mongoose");
const DOCUMENT_NAME = "userTiner";
const COLLECTION_NAME = "userTiners";

const userTinderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 22,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    birthDate: {
      type: String, // Store birthdate as a string in DD/MM/YYYY format
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    selectedInterests: {
      type: [String],
      default: [],
    },
    selectedGender: {
      type: String,
      enum: ["Male", "Female", "BothOFThem"],
      default: null,
    },
    selectedFavorite: {
      type: String,
      enum: ["Male", "Female", "BothOfThem"],
      default: null,
    },
    datingPurposes: {
      type: String,
      default: null,
    },
    selectedOptions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = { userTiner: mongoose.model(DOCUMENT_NAME, userTinderSchema) };
