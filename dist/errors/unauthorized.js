"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');
class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
module.exports = UnauthorizedError;
//# sourceMappingURL=unauthorized.js.map