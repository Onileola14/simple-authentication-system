"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');
class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found.js.map