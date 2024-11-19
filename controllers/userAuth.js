import jwt from "jsonwebtoken";
import { ExpressError } from "../utils/ExpressError";
export const authentication = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    throw new ExpressError(401, "Authentication token is expired");
  }
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      throw new ExpressError(403, "Token is expired please signin again");
    }
    req.user = user;
    next();
  });
};
