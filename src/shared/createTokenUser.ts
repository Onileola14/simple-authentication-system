import { TokenUserPayload } from "./src";
export const createTokenUser = (user: TokenUserPayload) => {
  return { name: user.name, userId: user.id, role: user.role, email: user.email };
}
