const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError } = require("../errors");
const createPermission = (reqUser, resourceUserId, res) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};

module.exports = { createPermission };
