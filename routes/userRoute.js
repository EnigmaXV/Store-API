const express = require("express");
const { protect, restrictTo } = require("../middlewares/authentication");

const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  updatePassword,
} = require("../controllers/usersController");

router.route("/").get(protect, restrictTo("admin"), getAllUsers);
router.route("/:id").get(getUser).patch(updateUser);

router.route("/update-password").patch(updatePassword);

module.exports = router;
