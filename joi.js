import Joi from "joi";
export const validateUser = Joi.object({
  firstname: Joi.string().min(3).required(),
  middlename: Joi.string(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{6,}$"
      )
    )
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  phone: Joi.string()
    .required()
    .min(10)
    .max(13)
    .pattern(new RegExp("^(\\+977-?)?(98|97)\\d{8}$")),
});

