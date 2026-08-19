"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateuser_middleware_1 = require("./authenticateuser.middleware");
const user_controller_1 = require("./user.controller");
const validators_1 = require("../middlewares/validators");
const router = express_1.default.Router();
router
    .route("/")
    .get(authenticateuser_middleware_1.authenticateUser, (0, authenticateuser_middleware_1.authorizePermissions)("admin"), user_controller_1.getAllUsers);
router
    .route("/:id")
    .get(authenticateuser_middleware_1.authenticateUser, user_controller_1.getSingleUser)
    .patch(authenticateuser_middleware_1.authenticateUser, validators_1.validateUpdateUser, user_controller_1.updateUser)
    .delete(authenticateuser_middleware_1.authenticateUser, user_controller_1.deleteUser);
router
    .route("/:id/password")
    .patch(authenticateuser_middleware_1.authenticateUser, validators_1.validateUpdatePassword, user_controller_1.updateUserPassword);
exports.default = router;
//# sourceMappingURL=user.route.js.map