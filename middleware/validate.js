import { validateUser } from "../joi.js";
import { expressError } from "../utils/expressError.js";
export const validUser = async (req, res, next) => {
  try {
    const { error, value: validUser } = validateUser.validate(req.body);
    if (error) {
      next(new expressError(400, error.message));
    }
    req.validUser = validUser;
    next();
  } catch (error) {
    next(new expressError(400, "Invalid user data"));
  }
};
