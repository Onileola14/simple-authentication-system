import { TokenUserPayload } from "./types";
export const createTokenUser = (user: TokenUserPayload) => {
  return { name: user.name, id: user.id, role: user.role, email: user.email };
}
