"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');
class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=unauthorized.js.map