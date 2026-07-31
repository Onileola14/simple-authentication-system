const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const {getAllUsers, getSingleUser, updateUser, deleteUser } = require("../controllers/user");

router.route("/").get(authenticateUser, getAllUsers);
router.route("/:id").get(authenticateUser, getSingleUser).patch(authenticateUser, updateUser).delete(authenticateUser, deleteUser);

module.exports = router;