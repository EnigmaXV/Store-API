const express = require("express");

const router = express.Router();

const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
} = require("../controllers/ordersController");

const { protect, restrictTo } = require("../middlewares/authentication");

router
  .route("/")
  .get(protect, restrictTo("admin"), getAllOrders)
  .post(protect, createOrder);

router.route("/my-orders").get(protect, getMyOrders);

router
  .route("/:id")
  .get(protect, getOrder)
  .patch(protect, restrictTo("admin"), updateOrder)
  .delete(protect, deleteOrder);

module.exports = router;
