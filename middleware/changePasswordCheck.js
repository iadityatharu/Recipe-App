import { expressError } from "../utils/expressError.js";
export const changePasswordCheck = (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const newValidPassword = newPassword === confirmPassword;
    if (!newValidPassword) {
      throw new expressError(400, "password does not match");
    }
    const password = {
      oldPassword,
      newPassword,
    };
    req.password = password;
    next();
  } catch (error) {
    next(error);
  }
};
