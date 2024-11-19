import jwt from "jsonwebtoken";
import { expressError } from "../utils/expressError.js";
const checkRefreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new expressError(401, "Authentication refresh token is expired");
  }
  jwt.verify(token, process.env.REFRESHTOKEN, (err, user) => {
    if (err) {
      throw new expressError(
        403,
        "Refresh token is expired, Please sign in again"
      );
    }
    next();
  });
};
export { checkRefreshToken };
