const express = require("express");
const { protect, restrictTo } = require("../middlewares/authentication");

const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  updatePassword,
  showActiveUser,
  deleteActiveUser,
} = require("../controllers/usersController");

router.route("/").get(protect, restrictTo("admin"), getAllUsers);
router.route("/me").get(protect, showActiveUser);
router.route("/updatePassword").patch(protect, updatePassword);
router.route("/updateMe").patch(protect, updateUser);
router.route("/deleteMe").post(protect, deleteActiveUser);
router.route("/:id").get(protect, getUser);

module.exports = router;
