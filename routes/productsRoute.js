const express = require("express");

const router = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
} = require("../controllers/productsController");

router.route("/").get(getAllProducts).post(createProduct);

router.route("/upload").post(uploadImage);

router.route("/:id").get(getProduct).delete(deleteProduct).patch(updateProduct);

module.exports = router;
