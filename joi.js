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
export const validateSignin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const validateBook = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  edition: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  language: Joi.string().required(),
  category: Joi.string().required(),
  condition: Joi.string().required(),
  searchTag: Joi.string().required(),
});
export const validateUrl = Joi.object({
  urls: Joi.array()
    .items(Joi.string().uri().required())
    .max(8)
    .required()
    .messages({
      "array.base": "URLs must be an array.",
      "array.max": "You can only upload a maximum of 8 URLs.",
      "string.uri": "Invalid URL format.",
      "string.empty": "URL cannot be empty.",
    }),
});
