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
