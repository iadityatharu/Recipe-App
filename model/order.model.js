import mongoose, { Types } from "mongoose";
const order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    recipe: {
      type: mongoose.Types.ObjectId,
      ref: "recipe",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("order", order);
export default Order;
