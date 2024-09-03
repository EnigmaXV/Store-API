const fs = require("fs");
require("dotenv").config();
const connectDB = require("../db/connectDb");
const Product = require("../models/productModel");

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

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

const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  }
};

const main = async () => {
  await connectToDatabase();

  if (process.argv[2] === "-i") {
    await importData();
  } else if (process.argv[2] === "-d") {
    await deleteData();
  } else {
    console.log(
      "Invalid argument. Use '-i' to import data or '-d' to delete data."
    );
    process.exit(1);
  }
};

main();
