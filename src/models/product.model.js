"use strict";
const mongoose = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

// Define the schemas
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_type: {
      type: String,
      required: true,
      enum: ["electronic", "clothing", "furniture", "book", "sports", "beauty"],
    },
    product_user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

productSchema.index({ product_name: "text", product_description: "text" });

// Variation Schemas
const variationSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const variationElectronicsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const variationFurnitureSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const variationBookSchema = new mongoose.Schema({
  format: { type: String, required: true }, // e.g., Hardcover, Paperback, eBook
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const variationSportsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const variationBeautySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., Skincare, Makeup
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// Category Schemas
const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    variations: [variationSchema],
  },
  {
    collection: "clothing",
    timestamps: true,
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    product_user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    variations: [variationElectronicsSchema],
  },
  {
    collection: "electronic",
    timestamps: true,
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    variations: [variationFurnitureSchema],
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "furniture",
    timestamps: true,
  }
);

const bookSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    variations: [variationBookSchema],
  },
  {
    collection: "book",
    timestamps: true,
  }
);

const sportsSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    variations: [variationSportsSchema],
  },
  {
    collection: "sports",
    timestamps: true,
  }
);

const beautySchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    variations: [variationBeautySchema],
  },
  {
    collection: "beauty",
    timestamps: true,
  }
);

module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  clothing: mongoose.model("clothing", clothingSchema),
  electronic: mongoose.model("electronic", electronicSchema),
  furniture: mongoose.model("furniture", furnitureSchema),
  book: mongoose.model("book", bookSchema),
  sports: mongoose.model("sports", sportsSchema),
  beauty: mongoose.model("beauty", beautySchema),
};
