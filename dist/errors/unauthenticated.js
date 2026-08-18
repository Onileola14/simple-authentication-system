"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = void 0;
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');
class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
//# sourceMappingURL=unauthenticated.js.map