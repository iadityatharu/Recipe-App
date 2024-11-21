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
