import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Recipe from "../model/recipe.model.js";
export const placeOrder = async (userId, orderItems) => {
  // Check if orderItems is an array
  if (!Array.isArray(orderItems)) {
    throw new Error("orderItems must be an array");
  }
  const { username, address, phone } = await User.findById(userId).select(
    "username address phone"
  );
  const { discountOn, amount } = await Discount.findOne({});
  let totalPrice = 0;
  let priceAfterDiscount = 0;
  let totalDiscount = 0;
  let book = [];
  for (const orderData of orderItems) {
    const bookId = orderData.id;
    const { title, price, discount } = await Book.findById(bookId);
    const newPrice = price - (discount * price) / 100;
    const accDiscount = (discount * price) / 100;
    book.push({
      title: title,
      price: price,
      discount: discount,
      total: newPrice,
    });
    priceAfterDiscount += newPrice;
    totalDiscount += accDiscount;
    totalPrice += price;
  }
  if (totalPrice > discountOn) {
    const offerDiscount = (totalPrice * amount) / 100;
    totalDiscount += offerDiscount;
    priceAfterDiscount -= offerDiscount;
  }
  const newOrder = new Order({
    username: username,
    address: address,
    phone: phone,
    books: book,
    totalPrice: totalPrice,
    totalDiscount: totalDiscount,
    priceAfterDiscount: priceAfterDiscount,
    status: "pending",
  });
  const orderDataFromDb = await newOrder.save();
  await User.findByIdAndUpdate(userId, {
    $push: { orders: orderDataFromDb._id },
    $pull: { cart: { $in: orderItems.map((item) => item.id) } },
  });
  return { message: "Order placed successfully" };
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
  const userData = await Order.find({}).sort({ createdAt: -1 });
  return userData;
};
// Service to update order status (admin)
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
