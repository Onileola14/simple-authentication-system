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
  updateUserPassword,
} = require("../controllers/user");
const {
  validateUpdateUser,
  validateUpdatePassword,
} = require("../middlewares/validators");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, deleteUser);
  
router.route("/:id/password").patch(authenticateUser, validateUpdatePassword, updateUserPassword);

module.exports = router;