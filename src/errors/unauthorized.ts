const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

export class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

