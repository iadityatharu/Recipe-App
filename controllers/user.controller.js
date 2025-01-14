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
    return res
      .status(201)
      .json({ status: 201, message: "New user created successfully" });
  } else if (response.status == 409) {
    throw new expressError(409, "User already exists");
  } else {
    throw new expressError(400, "Unable to create user");
  }
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new expressError(400, "Credentials required");
  }
  const response = await signinService({ email, password });
  if (response.status === 404) {
    throw new expressError(404, "User not found");
  } else if (response.status === 403) {
    throw new expressError(403, "Unauthorized");
  }
  res.cookie("accessToken", response.newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    expires: accessExpiry,
  });
  res.cookie("refreshToken", response.newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    expires: refreshExpiry,
  });
  return res.status(200).json({
    status: 200,
    message: "Signin successful",
    data: req.user.authClaims.role,
  });
};
export const getUserInfo = async (req, res) => {
  const userId = req.user.authClaims.id;
  const response = await getUserInfoService(userId);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  }
  return res.status(200).json({ status: 200, data: response });
};
export const updateAddress = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { address } = req.body;
  const response = await updateAddresService(userId, address);
  if (response.status !== 201) {
    throw new expressError(400, "Failed to update address");
  }
  return res
    .status(201)
    .json({ status: 201, message: "Update address successfully" });
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
    secure: true,
    expires: accessExpiry,
  });
  res
    .status(201)
    .json({ status: 201, message: "New access token is generated" });
};
export const logout = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  const incomingAccessToken = req.cookies.accessToken;
  if (!incomingRefreshToken && !incomingAccessToken) {
    throw new expressError(401, "Invalid Tokens");
  }
  res.clearCookie("accessToken", incomingRefreshToken);
  res.clearCookie("refreshToken", incomingAccessToken);
  res.status(200).json({ status: 200, message: "logout successfull" });
};
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  await sendEmail(otp, email);
  const response = await sendOtpService(otp, email);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  } else if (response.status === 201) {
    return res
      .status(201)
      .json({ status: 201, message: "Otp sent successfully" });
  } else {
    throw new expressError(400, "something went wrong");
  }
};
export const forgotPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  const response = await forgotPasswordService(email, otp, password);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  } else if (response.status === 403) {
    throw new expressError(403, "Invalid OTP");
  } else {
    return res
      .status(201)
      .json({ status: 201, message: "Password reset successfully" });
  }
};
export const changePassword = async (req, res) => {
  const token = req.cookies.refreshToken;
  const { userId } = jwt.verify(token, process.env.REFRESHTOKEN);
  const { oldPassword, newPassword } = req.password;
  const response = await changePasswordService(
    userId,
    oldPassword,
    newPassword
  );
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  } else if (response.status === 401) {
    throw new expressError(401, "Invalid credentials");
  } else {
    res.clearCookie("refreshToken");
    res
      .status(201)
      .json({ status: 201, message: "password change successfully" });
  }
};
export const search = async (req, res) => {
  const { firstname, lastname, phone, email } = req.body;
  const response = await searchService(firstname, lastname, phone, email);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  }
  return res.status(200).json({ status: 200, users: response.users });
};
