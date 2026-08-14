"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { authenticateUser, authorizePermissions, } = require("./authenticateuser.middleware");
const { getAllUsers, getSingleUser, updateUser, deleteUser, updateUserPassword, } = require("./user.controller");
const { validateUpdateUser, validateUpdatePassword, } = require("../middlewares/validators");
router
    .route("/")
    .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router
    .route("/:id")
    .get(authenticateUser, getSingleUser)
    .patch(authenticateUser, validateUpdateUser, updateUser)
    .delete(authenticateUser, deleteUser);
router.route("/:id/password").patch(authenticateUser, validateUpdatePassword, updateUserPassword);
module.exports = router;
//# sourceMappingURL=user.route.js.map