import type { Response } from "express";
import jwt from "jsonwebtoken";
import { TokenUserPayload } from "./types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_LIFETIME = process.env.JWT_LIFETIME;
if (!JWT_LIFETIME) {
  throw new Error("JWT_LIFETIME environment variable is required");
}

export const createJWT = ({ payload }: { payload: TokenUserPayload }) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_LIFETIME as jwt.SignOptions["expiresIn"],
  });
  return token;
};

export const isTokenValid = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as TokenUserPayload;
};

export const attachCookiesToResponse = (res: Response, user: TokenUserPayload) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: oneDay,
    signed: true,
  });
};