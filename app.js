const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const connectDB = require("./db/connectDb");
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");
const reviewsRoute = require("./routes/reviewsRoute");
const ordersRoute = require("./routes/ordersRoute");

//security packages
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/reviews", reviewsRoute);
app.use("/api/v1/orders", ordersRoute);

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const url = process.env.MONGO_URI.replace(
      "<db_password>",
      process.env.MONGO_PASSWORD
    );
    await connectDB(url);
    console.log("Connected to the database successfully 🚀");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
