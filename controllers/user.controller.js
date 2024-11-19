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
export const signin = async (req, res) => {
  const validSignin = req.validSignin;
  const response = await signinService(validSignin);
  if (response.status === 404) {
    throw new expressError(404, "User not found");
  } else if (response.status === 403) {
    throw new expressError(403, "Unauthorized");
  }
  res.cookie("accessToken", response.newAccessToken, {
    httpOnly: true,
    expires: accessExpiry,
  });
  res.cookie("refreshToken", response.newRefreshToken, {
    httpOnly: true,
    expires: refreshExpiry,
  });
  return res.status(200).json({ message: "Signin successful" });
};

export const getUserInfo = async (req, res) => {
  const userId = req.user.authClaims.id;
  const response = await getUserInfoService(userId);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  }
  return res.status(200).json(response);
};
export const updateAddress = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { address } = req.body;
  const response = await updateAddresService(userId, address);
  if (response.status !== 201) {
    throw new expressError(400, "Failed to update address");
  }
  return res.status(201).json({ message: "Update address successfully" });
};
export const generateToken = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new expressError(401, "Invalid Tokens");
  }
  const userId = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKEN);
  const response = await generateTokenService(userId);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  }
  res.cookie("accessToken", response.newAccessToken, {
    httpOnly: true,
    expires: accessExpiry,
  });
  res.status(201).json({ message: "New access token is generated" });
};
