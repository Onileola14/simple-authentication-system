"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenUser = void 0;
const createTokenUser = (user) => {
    return {
        name: user.name,
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    };
};
exports.createTokenUser = createTokenUser;
//# sourceMappingURL=createTokenUser.js.map