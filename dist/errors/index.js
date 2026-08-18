"use strict";
const custom_api_1 = require("./custom-api");
const unauthenticated_1 = require("./unauthenticated");
const not_found_1 = require("./not-found");
const bad_request_1 = require("./bad-request");
const unauthorized_1 = require("./unauthorized");
module.exports = {
    CustomAPIError: custom_api_1.CustomAPIError,
    UnauthenticatedError: unauthenticated_1.UnauthenticatedError,
    NotFoundError: not_found_1.NotFoundError,
    BadRequestError: bad_request_1.BadRequestError,
    UnauthorizedError: unauthorized_1.UnauthorizedError,
};
//# sourceMappingURL=index.js.map