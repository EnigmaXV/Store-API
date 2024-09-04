const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the review"],
      minlength: 5,
      maxlength: 100,
    },

    comment: {
      type: String,
      required: [true, "Please provide a review"],
      minlength: 10,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: [true, "Please provide rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

// Preventing user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
