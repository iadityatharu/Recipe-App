import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { accessToken, refreshToken } from "../function/token.js";
export const signup = async (validUser) => {
  const { firstname, middlename, lastname, password, email, phone, address } =
    validUser;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { status: 409 };
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    email,
    address,
    phone,
    password: hashPassword,
    ...(middlename && { middlename }),
  });
  await newUser.save();
  return { status: 201 };
};
export const signin = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return { status: 404 };
  }
  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    return { status: 403 };
  }
  const authClaims = {
    id: existingUser._id,
    role: existingUser.role,
  };
  const newAccessToken = await accessToken(authClaims);
  const newRefreshToken = await refreshToken(authClaims.id);
  existingUser.refreshToken = newRefreshToken;
  await existingUser.save();
  return { newAccessToken, newRefreshToken };
};
export const getUserInfo = async (userId) => {
  const data = await User.findById(userId).select(
    "-password -refreshToken -otp"
  );
  if (!data) {
    return { status: 404 };
  }
  return data;
};
export const updateAddres = async (userId, address) => {
  await User.findByIdAndUpdate(userId, { address });
  return { status: 201 };
};
export const generateToken = async ({ userId }) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return { status: 404 };
  }
  const authClaims = {
    id: user._id,
    role: user.role,
  };
  const newAccessToken = await accessToken(authClaims);
  return { newAccessToken };
};
export const sendOtp = async (otp, email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: 404 };
  }
  user.otp = otp;
  await user.save();
  return { status: 201 };
};
export const forgotPassword = async (email, otp, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: 404 };
  }
  // Check if OTP is correct and not expired
  const isOtpValid = otp === user.otp && user.otpExpiration > Date.now();
  if (!isOtpValid) {
    return { status: 403 };
  }
  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  user.otp = null;
  user.otpExpiration = null;
  await user.save();
  return { status: 201 };
};
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    return { status: 404 };
  }
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    return { status: 401 };
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  return { status: 201 };
};
export const search = async (username, phone, email) => {
  const user = await User.find({
    $or: [{ username: username }, { phone: phone }, { email: email }],
  }).select("-password -refreshToken -otp");
  if (!user) {
    return { status: 404 };
  }
  return { user };
};
