const fs = require("fs");
require("dotenv").config();
const connectDB = require("../db/connectDb");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, "utf-8"));

const url = process.env.MONGO_URI.replace(
  "<db_password>",
  process.env.MONGO_PASSWORD
);

const connectToDatabase = async () => {
  try {
    await connectDB(url);
    console.log("Connected to the database successfully 🚀");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const importProducts = async () => {
  try {
    await Product.create(products);
    console.log("Products imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const importOrders = async () => {
  try {
    await Order.create(orders);
    console.log("Orders imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const deleteProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products deleted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  }
};

const deleteOrders = async () => {
  try {
    await Order.deleteMany();
    console.log("Orders deleted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  }
};

const main = async () => {
  await connectToDatabase();

  if (process.argv[2] === "-orders") {
    if (process.argv[3] === "i") {
      await importOrders();
      process.exit(0);
    } else if (process.argv[3] === "d") {
      await deleteOrders();
      process.exit(0);
    } else {
      console.log("Invalid command");
      process.exit(1);
    }
  }

  if (process.argv[2] === "-products") {
    if (process.argv[3] === "i") {
      await importProducts();
    } else if (process.argv[3] === "d") {
      await deleteProducts();
    } else {
      console.log("Invalid command");
      process.exit(1);
    }
  }

  if (process.argv[2] === "-orders") {
    if (process.argv[3] === "i") {
      await importOrders();
    } else if (process.argv[3] === "d") {
      await deleteOrders();
    } else {
      console.log("Invalid command");
      process.exit(1);
    }
  }
};

main();
