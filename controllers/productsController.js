const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const Review = require("../models/reviewModel");
const path = require("path");

const getAllProducts = async (req, res) => {
  try {
    //filtering
    let queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    let query = Product.find(queryObj);

    //sorting
    const { sort } = req.query;
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //fields limiting
    const { fields } = req.query;
    if (fields) {
      const fieldsToShow = fields.split(",").join(" ");
      query = query.select(fieldsToShow);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const { page } = req.query * 1 || 1;
    const { limit } = req.query * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOfProducts = await Product.countDocuments();
      if (skip > numOfProducts) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Page not found" });
      }
    }

    const products = await query;
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
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Product not found" });
    }

    await Review.deleteMany({ product: product._id });

    await product.deleteOne();

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

const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find().sort("-rating price").limit(3);
    res.status(StatusCodes.OK).json({ success: true, products });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const getProductsStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { rating: { $gte: 4 } } },
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(StatusCodes.OK).json({ success: true, stats });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  getTopProducts,
  getProductsStats,
};
