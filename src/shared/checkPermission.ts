
import { UnauthorizedError } from "../errors/unauthorized";
import { TokenUserPayload } from "../shared/src";

export const createPermission = (
  reqUser: TokenUserPayload,
  resourceUserId: string
) => {
  if (reqUser.role === "admin") return;
  if (reqUser.id === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};