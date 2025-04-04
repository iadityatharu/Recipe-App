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
import { getUserById as getUserByIdService } from "../services/user.service.js";
import { accessExpiry } from "../constant.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOtp } from "../function/generateOtp.js";
import { editUser as editUserService } from "../services/user.service.js";
import { makeAdmin as makeAdminService } from "../services/user.service.js";
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
  console.log(response.newAccessToken);
  res.cookie("accessToken", response.newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: accessExpiry,
    path:"/"
  });
  return res.status(200).json({
    status: 200,
    message: "Signin successful",
    role: response.role,
  });
};
export const editUser = async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  const result = await editUserService(userId, updatedUser);
  if (result.status === 200) {
    return res.status(200).json({ message: result.message });
  } else {
    return res
      .status(result.status)
      .json({ message: result.message || "An error occurred" });
  }
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
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await getUserByIdService(userId);

  if (!user) {
    return res.status(404).json({ status: 404, message: "User not found" });
  }
  return res.status(200).json({ status: 200, data: user });
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

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  res.status(200).json({ 
    status: 200, 
    message: "Logout successful" 
  });
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
  return res.status(200).json({ status: 200, data: total });
};

export const makeAdmin = async (req, res) => {
  const { userid } = req.query;
  const { Role } = req.body;
  const response = await makeAdminService(userid, Role);
  return res.status(200).json({ status: 200, message: response });
};
