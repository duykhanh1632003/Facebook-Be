const mongoose = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const attributeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  value: { type: String, required: true },
});

const productVariationSchema = new mongoose.Schema({
  attributes: [attributeSchema],
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

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
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    images: [{ type: String }],
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    product_variations: [productVariationSchema],
    orders_count: { type: Number, default: 0 },
    favorites_count: { type: Number, default: 0 },
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

module.exports = { product: mongoose.model(DOCUMENT_NAME, productSchema) };
