import { IUser } from "../models/User";
import { TokenUserPayload } from "./types";

export const createTokenUser = (user: IUser): TokenUserPayload => {
  return {
    name: user.name,
    userId: (user._id as any).toString(),
    role: user.role,
    email: user.email,
  };
};