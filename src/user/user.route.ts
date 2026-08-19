import express from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "./authenticateuser.middleware";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from "./user.controller";
import {
  validateUpdateUser,
  validateUpdatePassword,
} from "../middlewares/validators";

const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, validateUpdateUser, updateUser)
  .delete(authenticateUser, deleteUser);

router
  .route("/:id/password")
  .patch(authenticateUser, validateUpdatePassword, updateUserPassword);

export default router;
