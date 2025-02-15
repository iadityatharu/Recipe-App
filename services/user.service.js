import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { accessToken } from "../function/token.js";
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
  await existingUser.save();
  return { newAccessToken, role: existingUser.role };
};
export const getUserRole = async (userId) => {
  const user = await User.findById(userId).select("role");
  return user;
};
export const editUser = async (userId, updatedUser) => {
  const { firstname, middlename, lastname, email, phone, role, address } =
    updatedUser;
  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, message: "User not found" };
  }
  let updatedData = {
    firstname,
    lastname,
    email,
    phone,
    role,
    address,
    ...(middlename && { middlename }),
  };
  await User.findByIdAndUpdate(userId, updatedData);
  return { status: 200, message: "User updated successfully" };
};
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password -otp");
  if (!user) {
    return { status: 404 };
  }
  return user;
};

export const getAllUsers = async () => {
  const users = await User.find().select("-password  -otp");
  if (users.length === 0) {
    return { status: 404 };
  }
  return users;
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
  const isOtpValid = String(otp).trim() === String(user.otp).trim();

  if (!isOtpValid) {
    return { status: 403 };
  }

  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  user.otp = null;
  await user.save();
  return { status: 201 };
};
export const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
  return "User deleted successfully";
};
export const getUserInfo = async (userId) => {
  const response = await User.findById(userId).select(
    "-otp -password -favourites -orders -createdAt -updatedAt -__v"
  );
  return response;
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
export const search = async (firstname, lastname, phone, email) => {
  const query = {
    $or: [],
  };
  if (phone) query.$or.push({ phone: phone });
  if (email) query.$or.push({ email: email });
  if (firstname) query.$or.push({ firstname: firstname });
  if (lastname) query.$or.push({ lastname: lastname });
  const users = await User.find(query).select("-password -refreshToken -otp");
  if (users.length === 0) {
    return { status: 404, message: "No users found." };
  }
  return { users };
};
export const getTotalUser = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    return { status: 404, message: "No user found." };
  }
  return count;
};
export const makeAdmin = async (userId, Role) => {
  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, message: "User not found" };
  }
  user.role = Role;
  await user.save();

  return { status: 200, message: "Admin created successfully" };
};
