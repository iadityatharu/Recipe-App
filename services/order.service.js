import stripe from "../config/stripe.config.js";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";

export const placeOrder = async (userId, recipeId, paymentMethodId) => {
  const [user, recipe] = await Promise.all([
    User.findById(userId).select("username address phone"),
    Recipe.findById(recipeId),
  ]);
  if (!user) {
    throw new expressError(404, "User not found");
  }
  if (!recipe) {
    throw new expressError(404, "Recipe not found");
  }
  const { username, address, phone } = user;
  const { title, price } = recipe;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), 
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });
    if (paymentIntent.status !== "succeeded") {
      throw new expressError(402, "Payment confirmation failed");
    }
    const newOrder = new Order({
      user: userId,
      title: title,
      recipe: recipeId,
      username: username,
      address: address,
      phone: phone,
      payment: {
        paymentId: paymentIntent.id,
        amount: price,
        currency: "usd",
        status: paymentIntent.status,
      },
      status: "pending",
    });
    const orderDataFromDb = await newOrder.save();
    return {
      message: "Order placed successfully",
      orderId: orderDataFromDb._id,
      paymentStatus: paymentIntent.status,
    };
  } catch (error) {
    throw new expressError(500, "An error occurred while placing the order");
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
