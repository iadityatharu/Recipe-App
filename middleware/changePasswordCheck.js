import { expressError } from "../utils/expressError.js";

export const changePasswordCheck = (req, res, next) => {
  try {
    let { oldPassword, newPassword, confirmPassword } = req.body;
    oldPassword = String(oldPassword);
    newPassword = String(newPassword);
    confirmPassword = String(confirmPassword);
    const newValidPassword = newPassword === confirmPassword;
    if (!newValidPassword) {
      throw new expressError(400, "Password does not match");
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
