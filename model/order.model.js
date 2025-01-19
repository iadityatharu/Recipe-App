import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    payment: {
      paymentId: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: "usd" },
      status: { type: String, default: "pending" },
    },
    status: {
      type: String,
      default: "notPurchased",
      enum: ["notPurchased", "purchased", "cancelled", "pending"], // Add "pending" here
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
