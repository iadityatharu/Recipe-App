import { validate, IsString, MinLength, maxLength } from "class-validator";
export class User {
  constructor({ user }) {
    this.username = user.username;
    this.email = user.email;
    this.address = user.address;
    this.phone = user.phone;
    this.password = user.password;
    this.role = user.role;
  }
}
User.prototype.username = null;
User.prototype.email = null;
User.prototype.address = null;
User.prototype.phone = null;
User.prototype.password = null;
User.prototype.role = null;
MinLength(4)(User.prototype, "username");
IsString()(User.prototype, "email");
IsString()(User.prototype, "address");
MinLength(10)(User.prototype, "phone");
MinLength(4)(User.prototype, "password");
IsString()(User.prototype, "role");

export const reqValidate = async (User) => {
  await validate(User).then((errors) => {
    if (errors.length > 0) {
      console.log("Validation errors : ", errors);
    } else {
      console.log("User object is valid!");
    }
  });
};
