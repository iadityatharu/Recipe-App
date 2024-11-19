import { expressError } from "../utils/expressError.js";
export const isAdmin = async (req, res, next) => {
  try {
    const role = req.user.authClaims.role;
    if (role !== "admin") {
      throw new expressError(401, "Unauthorized");
    }
    next();
  } catch (error) {
    next(error);
  }
};
