const { StatusCodes } = require("http-status-codes");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const checkPermissions = require("../utils/checkPermissions");

const getAllReviews = async (req, res) => {
  try {
    // const reviews = await Review.find({})
    const reviews = await Review.find({})
      .populate({
        path: "product",
        select: "name price",
      })
      .populate({ path: "user", select: "name" })
      .select("-__v  -createdAt");
    res
      .status(StatusCodes.OK)
      .json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No review with id : ${id}` });
    }
    res.status(StatusCodes.OK).json({ success: true, review });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};
const createReview = async (req, res) => {
  try {
    const { title, comment, rating, product: productId } = req.body;
    const exitedProduct = await Product.findOne({ _id: productId });
    if (!exitedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product found with id: ${productId}` });
    }
    const review = await Review.create({
      title,
      comment,
      rating,
      product: productId,
      user: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({ review });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, comment, rating } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: id },
      { title, comment, rating },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No review with id : ${id}` });
    }

    checkPermissions(req.user, review.user, res);
    res.status(StatusCodes.OK).json({ review });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOneAndDelete({ _id: id });

    checkPermissions(req.user, review.user, res);

    res.status(StatusCodes.OK).json({ success: true, msg: "Review deleted" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
