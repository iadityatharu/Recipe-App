import stripe from "../config/stripe.config.js";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";

export const placeOrder = async (userId, recipeId, paymentMethodId) => {
  const { username, address, phone } = await User.findById(userId).select(
    "username address phone"
  );
  const { title, price } = await Recipe.findById(recipeId);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(price * 100),
    currency: "usd",
    payment_method: paymentMethodId,
    confirm: true,
  });
  const newOrder = new Order({
    user: userId,
    recipe: recipeId,
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

export const updateOrder = async (orderId, status) => {
  await Order.findByIdAndUpdate(orderId, { status });
  return { message: "Status updated successfully" };
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
