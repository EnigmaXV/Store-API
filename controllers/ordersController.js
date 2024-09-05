const { StatusCodes } = require("http-status-codes");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const checkPermissions = require("../utils/checkPermissions");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate({
      path: "user",
      select: "name email",
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order with id : ${id}` });
    }
    checkPermissions(req.user, order.user, res);
    res.status(StatusCodes.OK).json({ success: true, order });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { tax, shipping, orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No order items" });
    }
    if (!tax || !shipping) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide tax and shipping cost" });
    }

    let cartItems = [];
    let subtotal = 0;

    for (let cartItem of orderItems) {
      const { product: productId } = cartItem;

      const product = await Product.findOne({ _id: productId });

      if (!product) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: `No product found with id: ${productId}` });
      }

      const { name, price, image, _id } = product;
      const item = {
        amount: cartItem.amount,
        name,
        price,
        image,
        product: _id,
      };

      cartItems.push(item);
      subtotal += product.price * quantity;
    }

    const total = subtotal + tax + shipping;

    const order = await Order.create({
      user: req.user.userId,
      orderItems: cartItems,
      tax,
      shipping,
      total,
    });

    res.status(StatusCodes.CREATED).json({ order });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate({ _id: id }, status, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order with id : ${id}` });
    }
    res.status(StatusCodes.OK).json({ success: true, order });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: id });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order with id : ${id}` });
    }
    checkPermissions(req.user, order.user, res);
    res.status(StatusCodes.OK).json({ success: true, msg: "Order deleted" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId });
    res
      .status(StatusCodes.OK)
      .json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};
module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
};
