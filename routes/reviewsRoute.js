const express = require("express");

const router = express.Router();

const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

const { protect, restrictTo } = require("../middlewares/authentication");

router.route("/").get(getAllReviews).post(protect, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
