import mongoose from "mongoose";

// Creating Schema
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
      required: false,
    },
    lastname: {
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
    otp: {
      type: Number,
      default: () => new Date(Date.now() + 2 * 60 * 1000), // Default to 2 minutes from now
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
