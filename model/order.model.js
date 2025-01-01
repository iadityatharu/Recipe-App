import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true, 
    },
    recipe: {
      type: mongoose.Types.ObjectId,
      ref: "recipe",
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
      default: "pending",
      enum: ["pending", "processing", "delivered", "cancelled"], 
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
