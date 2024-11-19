import { signup as signupService } from "../services/user.service.js";
import { signin as signinService } from "../services/user.service.js";
import { getUserInfo as getUserInfoService } from "../services/user.service.js";
import { updateAddres as updateAddresService } from "../services/user.service.js";
import { generateToken as generateTokenService } from "../services/user.service.js";
import { sendOtp as sendOtpService } from "../services/user.service.js";
import { forgotPassword as forgotPasswordService } from "../services/user.service.js";
import { changePassword as changePasswordService } from "../services/user.service.js";
import { search as searchService } from "../services/user.service.js";
import { expressError } from "../utils/expressError.js";
import jwt from "jsonwebtoken";
import { accessExpiry, refreshExpiry } from "../constant.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOtp } from "../function/generateOtp.js";
export const signup = async (req, res) => {
  const validUser = req.validUser;
  const response = await signupService(validUser);
  if (response.status === 201) {
    return res.status(201).json({ message: "New user created successfully" });
  } else if (response.status == 409) {
    throw new expressError(409, "User already exists");
  } else {
    throw new expressError(400, "Unable to create user");
  }
};
