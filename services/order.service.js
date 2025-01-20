import stripePackage from "stripe";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (userId, recipeId, paymentMethodId) => {
  const [user, recipe] = await Promise.all([
    User.findById(userId).select("firstname middlename lastname address phone"),
    Recipe.findById(recipeId).select("title price"),
  ]);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }
  if (!recipe) {
    throw { statusCode: 404, message: "Recipe not found" };
  }

  const { firstname, middlename, lastname, address, phone } = user;
  const { title, price } = recipe;

  const fullName = [firstname, middlename, lastname].filter(Boolean).join(" ");
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(price * 100),
    currency: "usd",
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });

  if (paymentIntent.status !== "succeeded") {
    throw { statusCode: 402, message: "Payment confirmation failed" };
  }
  const order = await new Order({
    user: userId,
    recipe: recipeId,
    username: fullName,
    recipeTitle: title,
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
  await User.findByIdAndUpdate(
    userId,
    { $push: { orders: order._id } },
    { new: true }
  );
  return {
    statusCode: 200,
    message: "Order placed successfully",
    orderId: order._id,
    paymentStatus: paymentIntent.status,
  };
};

export const orderHistory = async (userId) => {
  const userData = await User.findById(userId).select("orders").populate({
    path: "orders",
  });

  const ordersWithRecipeTitles = [];

  if (userData && userData.orders) {
    for (const order of userData.orders) {
      const recipe = await Recipe.findById(order.recipe.toString()).select(
        "title"
      );
      ordersWithRecipeTitles.push({
        orderId: order._id,
        recipeId: order.recipe,
        recipeTitle: recipe ? recipe.title : "Unknown Recipe",
        price: order.payment.amount,
        purchaseDate: order.createdAt,
      });
    }
  }
  return ordersWithRecipeTitles.reverse();
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
