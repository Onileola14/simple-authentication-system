const {StatusCodes} = require("http-status-codes");
const createPermission = (reqUser, resourceUserId, res) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === resourceUserId.toString()) return;
  res.status(StatusCodes.FORBIDDEN).json({ msg: "Not authorized to access this route" });
};

module.exports = { createPermission };
