const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: 3,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },

    description: {
      type: String,
      required: [true, "Please provide a description"],
      minlength: 10,
      maxlength: 500,
    },

    image: String,

    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Electronics", "Books", "Clothes", "Games", "Beauty", "Sports"],
    },

    company: {
      type: String,
      required: [true, "Please provide a company"],
    },

    colors: [String],

    stock: {
      type: Number,
      default: 10,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
