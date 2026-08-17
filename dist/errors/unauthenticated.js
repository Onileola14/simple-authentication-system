"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');
class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
module.exports = UnauthenticatedError;
//# sourceMappingURL=unauthenticated.js.map