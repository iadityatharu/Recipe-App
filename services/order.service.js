import stripePackage from "stripe";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (userId, recipeId, paymentMethodId) => {
  try {
    const [user, recipe] = await Promise.all([
      User.findById(userId).select(
        "firstname middlename lastname address phone stripeCustomerId"
      ),
      Recipe.findById(recipeId).select("title price"),
    ]);

    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }
    if (!recipe) {
      throw { statusCode: 404, message: "Recipe not found" };
    }

    const {
      firstname,
      middlename,
      lastname,
      address,
      phone,
      stripeCustomerId,
    } = user;
    const { title, price } = recipe;

    const fullName = [firstname, middlename, lastname]
      .filter(Boolean)
      .join(" ");

    // If user doesn't have a stripeCustomerId, create a new Stripe Customer
    let stripeCustomer = stripeCustomerId;
    if (!stripeCustomer) {
      const newStripeCustomer = await stripe.customers.create({
        email: user.email, // Optional: You can store the email
        name: fullName,
        phone: user.phone, // Optional
      });

      stripeCustomer = newStripeCustomer.id;

      // Save stripeCustomerId to the user's database
      user.stripeCustomerId = stripeCustomer;
      await user.save();
    }

    // Check if the payment method is already attached to a customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.customer) {
      // Detach the payment method if it's attached to a different customer
      if (paymentMethod.customer !== stripeCustomer) {
        await stripe.paymentMethods.detach(paymentMethodId);
      }
    }

    // Attach the payment method to the Stripe customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomer,
    });

    // Optionally, set the payment method as the default for the customer
    await stripe.customers.update(stripeCustomer, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      customer: stripeCustomer, // Attach the customer
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    if (paymentIntent.status !== "succeeded") {
      throw { statusCode: 402, message: "Payment confirmation failed" };
    }

    // Create an order and save it to the database
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

    // Add the order to the user's orders list
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
  } catch (error) {
    // Handle payment method attachment errors
    if (error.message && error.message.includes("already been attached")) {
      // Payment method is attached to another customer. You can prompt the user to enter a new card.
      throw {
        statusCode: 402,
        message:
          "The payment method has already been attached to another customer. Please use a different payment method.",
      };
    }

    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    };
  }
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
export const deleteOrder = async (orderId) => {
  const response = await Order.findByIdAndDelete(orderId);
  return "order deleted successfully";
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
