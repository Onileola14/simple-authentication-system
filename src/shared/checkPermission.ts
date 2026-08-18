
import { UnauthorizedError } from "../errors";
import { TokenUserPayload } from "./types";

export const createPermission = (
  reqUser: TokenUserPayload,
  resourceUserId: string
) => {
  if (reqUser.role === "admin") return;
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};