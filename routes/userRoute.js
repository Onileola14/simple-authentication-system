const express = require("express");
const router = express.Router();
const {getAllUsers, getSingleUser} = require("../controllers/user");

router.route("/").get(getAllUsers);
router.route("/:id").get(getSingleUser);

module.exports = router;