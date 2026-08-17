"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermission = void 0;
const errors_1 = require("../errors");
const createPermission = (reqUser, resourceUserId) => {
    if (reqUser.role === "admin")
        return;
    if (reqUser.id === resourceUserId.toString())
        return;
    throw new errors_1.UnauthorizedError("Not authorized to access this route");
};
exports.createPermission = createPermission;
//# sourceMappingURL=checkPermission.js.map