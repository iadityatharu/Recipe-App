import {
  validateUser,
  validateUrl,
  validateBook,
  validateSignin,
  validateDiscount,
} from "../joi.js";
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
export const validBook = (req, res, next) => {
  try {
    const { err, value: validUrl } = validateUrl.validate(req.file);
    if (err) {
      throw new expressError(400, err.message);
    }
    const { error, value: validBook } = validateBook.validate(req.body);
    if (error) {
      throw new expressError(400, error.message);
    }
    req.validBook = validBook;
    req.validUrl = validUrl;
    next();
  } catch (error) {
    throw new expressError(400, error.message);
  }
};
export const validSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error, value: validSignin } = validateSignin.validate({
      email,
      password,
    });
    if (error) {
      throw new expressError(400, error.message);
    }
    req.validSignin = validSignin;
    next();
  } catch (error) {
    next(error);
  }
};


