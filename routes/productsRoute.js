const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/authentication");

const {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
} = require("../controllers/productsController");

router.route("/").get(getAllProducts).post(protect, createProduct);

router.route("/upload").post(protect, uploadImage);

router
  .route("/:id")
  .get(protect, getProduct)
  .delete(protect, restrictTo("admin"), deleteProduct)
  .patch(protect, restrictTo("admin"), updateProduct);

module.exports = router;
