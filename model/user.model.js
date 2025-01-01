import mongoose from "mongoose";

// Creating Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    favourites: [
      {
        type: mongoose.Types.ObjectId, 
        ref: "recipes",
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "recipes",
      },
    ],
  },
  { timestamps: true }
);

// Creating Model name User in the reference of userSchema
const User = mongoose.model("User", userSchema);
export default User;
