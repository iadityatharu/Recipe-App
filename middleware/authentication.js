import jwt from "jsonwebtoken";
import { expressError } from "../utils/expressError.js";
export const authentication = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    throw new expressError(401, "Authentication token is expired");
  }
  jwt.verify(token, process.env.ACCESSTOKEN, (err, user) => {
    if (err) {
      throw new expressError(403, "Token is expired, Please sign in again");
    }
    req.user = user;
    next();
  });
};
