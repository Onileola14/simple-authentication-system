"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');
class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
module.exports = NotFoundError;
//# sourceMappingURL=not-found.js.map