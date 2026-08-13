
const { UnauthorizedError } = require("../errors");
export const createPermission = (reqUser, resourceUserId) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};


