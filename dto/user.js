import { User } from "./userDto.js";
import { validate } from "class-validator";

const user = {
  username: "aditya",
  email: "aditya@gmail.com",
  password: "123456",
  address: "kapilvastu",
  phone: "9844806982",
  role: "user",
};
const Adi = new User({ user });
validate(Adi).then((errors) => {
  if (errors.length > 0) {
    console.log("validation error:", errors);
  } else {
    console.log("User created successfully");
  }
});
