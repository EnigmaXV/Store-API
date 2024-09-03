const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).select(
      "-__v -createdAt -updatedAt"
    );
    res
      .status(StatusCodes.OK)
      .json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id }).select(
      "-__v -createdAt -updatedAt"
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id : ${id}` });
    }
    res.status(StatusCodes.OK).json({ success: true, product });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({ product });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ _id: id });
    res.status(StatusCodes.OK).json({ success: true, msg: "Product deleted" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Product not found" });
    }

    res.status(StatusCodes.OK).json({ success: true, product });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    //console.log(req.files);
    if (!req.files) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No file uploaded" });
    }
    const { image } = req.files;

    if (!image.mimetype.startsWith("image")) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please upload an image file" });
    }

    if (image.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      });
    }
    const imagePath = path.join(__dirname, `../public/uploads/${image.name}`);
    await image.mv(imagePath);
    res.status(StatusCodes.OK).json({
      success: true,
      image: `Your image ${image.name} uploaded successfully`,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
