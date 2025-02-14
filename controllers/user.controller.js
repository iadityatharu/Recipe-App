import { signup as signupService } from "../services/user.service.js";
import { signin as signinService } from "../services/user.service.js";
import { sendOtp as sendOtpService } from "../services/user.service.js";
import { forgotPassword as forgotPasswordService } from "../services/user.service.js";
import { changePassword as changePasswordService } from "../services/user.service.js";
import { getUserRole as getUserRoleService } from "../services/user.service.js";
import { search as searchService } from "../services/user.service.js";
import { expressError } from "../utils/expressError.js";
import { getUserInfo as getUserInfoService } from "../services/user.service.js";
import { deleteUser as deleteUserService } from "../services/user.service.js";
import { getAllUsers as getAllUsersService } from "../services/user.service.js";
import { getTotalUser as getTotalUserService } from "../services/user.service.js";
import { accessExpiry } from "../constant.js";
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
    throw new expressError(403, "Invalid Credentials");
  }
  res.cookie("accessToken", response.newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    expires: accessExpiry,
  });
  return res.status(200).json({
    status: 200,
    message: "Signin successful",
    role: response.role,
  });
};
export const getUserRole = async (req, res) => {
  const userId = req.user.authClaims.id;
  const response = await getUserRoleService(userId);
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  }
  return res.status(200).json(response);
};

export const getAllUsers = async (req, res) => {
  const response = await getAllUsersService();
  if (response.status === 404) {
    throw new expressError(404, "user not found");
  }
  return res.status(200).json(response);
};
export const getUserInfo = async (req, res) => {
  const userId = req.user.authClaims.id;
  if (!userId) {
    throw new expressError(404, "User not found");
  }
  const response = await getUserInfoService(userId);
  return res.status(200).json(response);
};
export const logout = async (req, res) => {
  const incomingAccessToken = req.cookies.accessToken;
  if (!incomingAccessToken) {
    throw new expressError(401, "Invalid Tokens");
  }
  res.clearCookie("accessToken", incomingAccessToken);
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
  const { email, otp, newPassword } = req.body;
  const response = await forgotPasswordService(email, otp, newPassword);
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
export const deleteUser = async (req, res) => {
  const { userid } = req.body;
  const response = await deleteUserService(userid);
  return res.status(200).json({ status: 200, message: response });
};
export const changePassword = async (req, res) => {
  const userId = req.user.authClaims.id;
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
export const getTotalUser = async (req, res) => {
  const total = await getTotalUserService();
  return res.status(200).json({status:200, data: total });
};
