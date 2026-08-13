import type { Response } from "express";
import jwt from "jsonwebtoken"

export const createJWT = ({payload}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const attachCookiesToResponse = (res:Response, user) => {
  const token = createJWT({payload: user});
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: oneDay,
    signed: true,
  });
};

