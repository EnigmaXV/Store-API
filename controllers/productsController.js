const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");

const getAllProducts = async (req, res) => {
  res.send("Get all products");
};

const getProduct = async (req, res) => {
  res.send("Get single product");
};

const createProduct = async (req, res) => {
  res.send("Create product");
};

const deleteProduct = async (req, res) => {
  res.send("Delete product");
};

const updateProduct = async (req, res) => {
  res.send("Update product");
};

const uploadImage = async (req, res) => {
  res.send("Upload image");
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
