import jwt from "jsonwebtoken";
import { expressError } from "../utils/expressError.js";
export const accessToken = async (authClaims) => {
  if (!process.env.ACCESSTOKEN || !process.env.ACCESSEXPIRE) {
    throw new expressError(400, "Token configuration is missing");
  }
  const accessToken = jwt.sign({ authClaims }, process.env.ACCESSTOKEN, {
    expiresIn: process.env.ACCESSEXPIRE,
  });
  return accessToken;
};
export const refreshToken = async (userId) => {
  if (!process.env.REFRESHTOKEN || !process.env.REFRESHEXPIRE) {
    throw new expressError(400, "Token configuration is missing");
  }
  const refreshToken = jwt.sign({ userId }, process.env.REFRESHTOKEN, {
    expiresIn: process.env.REFRESHEXPIRE,
  });
  return refreshToken;
};
