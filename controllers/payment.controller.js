import stripe from "../config/stripe.config.js";
import Order from "../model/order.model.js";
import { expressError } from "../utils/expressError.js";

// Create a PaymentIntent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, userId, recipeId } = req.body;
    if (!amount || !currency || !userId || !recipeId) {
      throw new expressError(400, "Missing required fields");
    }
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // Example: 'usd'
      payment_method_types: ["card"], // Accept card payments
    });
    // Save order details in the database
    const order = new Order({
      user: userId,
      recipe: recipeId,
      payment: {
        paymentId: paymentIntent.id,
        amount,
        currency,
        status: "pending",
      },
    });

    await order.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, // Needed by the frontend
      orderId: order._id,
    });
  } catch (error) {
    throw new expressError(500, "Internal server error");
  }
};
