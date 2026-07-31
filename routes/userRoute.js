const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authenticateUser");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

router.route("/").get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, deleteUser);

module.exports = router;
