import stripePackage from "stripe";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";
const stripeInstance = stripePackage(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (userId, recipeIds, paymentMethodId) => {
  try {
    if (!userId || !recipeIds.length || !paymentMethodId) {
      throw new Error("Missing required fields");
    }

    const user = await User.findById(userId).select(
      "firstname middlename lastname email phone address orders"
    );
    if (!user) throw new Error("User not found");

    const recipes = await Recipe.find({ _id: { $in: recipeIds } });
    if (recipes.length !== recipeIds.length)
      throw new Error("One or more recipes not found");

    const totalAmount = recipes.reduce((sum, recipe) => sum + recipe.price, 0);

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment failed");
    }

    const username = [user.firstname, user.middlename, user.lastname]
      .filter(Boolean)
      .join(" ");

    const newOrder = new Order({
      user: userId,
      recipe: recipeIds,
      username: username,
      recipeTitle: recipes.map((r) => r.title).join(", "),
      phone: user.phone,
      address: user.address,
      payment: {
        paymentId: paymentIntent.id,
        amount: totalAmount,
        currency: "usd",
        status: "succeeded",
      },
      status: "purchased",
    });

    await newOrder.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { carts: { $in: recipeIds } },
      $push: { orders: newOrder._id },
    });

    const recipeDetails = recipes.map((recipe) => ({
      title: recipe.title,
      price: recipe.price,
    }));

    return {
      success: true,
      message: "Order placed successfully",
      orderDetails: {
        recipes: recipeDetails,
        totalAmount: totalAmount,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const orderHistory = async (userId) => {
  const orders = await Order.find({ user: userId }).populate("recipe");
  if (orders.length > 0) {
    const orderDetails = orders.flatMap((order) =>
      order.recipe.map((recipe) => ({
        orderId: order._id,
        recipeId: recipe._id,
        recipeTitle: recipe.title,
        recipePrice: recipe.price,
        purchasedDate: order.createdAt,
      }))
    );
    return orderDetails;
  } else {
    return "No order history found";
  }
};

export const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId).select("user");
  const userId = order ? order.user : null;
  if (userId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { orders: orderId },
    });
  }
  const response = await Order.findByIdAndDelete(orderId);
  if (response) {
    return "Order deleted successfully";
  } else {
    throw new Error("Order not found");
  }
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

export const getTotalOrder = async () => {
  const totalOrder = await Order.countDocuments();
  if (totalOrder === 0) {
    return { status: 404, message: "No order found" };
  }
  return totalOrder;
};
export const totalSale = async () => {
  const orders = await Order.find();
  const totalSum = orders.reduce((sum, order) => {
    return sum + order.payment.amount;
  }, 0);
  return totalSum;
};
export const monthlySale = async (year, month) => {
  const startOfMonth = new Date(year, month - 1, 1); // month is 1-based (Jan is 1)
  const endOfMonth = new Date(year, month, 0); // Last day of the month

  const orders = await Order.find({
    "payment.date": { $gte: startOfMonth, $lte: endOfMonth },
  });

  const totalSum = orders.reduce((sum, order) => {
    return sum + order.payment.amount;
  }, 0);

  return totalSum;
};
