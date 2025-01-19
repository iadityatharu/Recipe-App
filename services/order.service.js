import stripePackage from "stripe";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";
import { expressError } from "../utils/expressError.js";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (userId, recipeId, paymentMethodId) => {
  try {
    // Fetch user and recipe details
    const [user, recipe] = await Promise.all([
      User.findById(userId).select("username address phone"),
      Recipe.findById(recipeId),
    ]);

    if (!user || !recipe) {
      throw new expressError(404, `${!user ? "User" : "Recipe"} not found`);
    }

    const { username, address, phone } = user;
    const { title, price } = recipe;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100),
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    if (paymentIntent.status !== "succeeded") {
      throw new expressError(402, "Payment confirmation failed");
    }

    // Create and save the order
    const order = await new Order({
      user: userId,
      recipe: recipeId,
      username,
      address,
      phone,
      payment: {
        paymentId: paymentIntent.id,
        amount: price,
        currency: "usd",
        status: paymentIntent.status,
      },
      status: "purchased",
    }).save();

    return {
      message: "Order placed successfully",
      orderId: order._id,
      paymentStatus: paymentIntent.status,
    };
  } catch (error) {
    console.error("Error placing order:", error.message);
    const errorMessage =
      error.type === "StripeCardError"
        ? "Your card was declined"
        : error.message || "An error occurred while placing the order";

    throw new expressError(error.statusCode || 500, errorMessage);
  }
};

export const orderHistory = async (userId) => {
  const userData = await User.findById(userId)
    .sort({ createdAt: -1 })
    .select("orders")
    .populate({
      path: "orders",
    });
  return userData.orders.reverse();
};
export const getAllOrder = async () => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return orders;
};
export const search = async (username, recipe, phone, address, status) => {
  const order = await Order.find({
    $or: [
      { username: username },
      { recipe: recipe },
      { phone: phone },
      { address: address },
      { status: status },
    ],
  }).select("-createdAt -updatedAt");
  return order;
};
