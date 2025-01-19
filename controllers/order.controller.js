import {
  placeOrder as placeOrderService,
  orderHistory as orderHistoryService,
  getAllOrder as getAllOrderService,
  search as searchService,
} from "../services/order.service.js";
import { expressError } from "../utils/expressError.js";
export const placeOrder = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { recipeId, paymentMethodId } = req.body;
  console.log(recipeId);
  console.log(paymentMethodId);
  if (!recipeId || !paymentMethodId) {
    throw new expressError(400, "Recipe ID and Payment Method ID are required");
  }
  const response = await placeOrderService(userId, recipeId, paymentMethodId);
  return res.status(200).json({
    status: 200,
    message: response.message,
    orderId: response.orderId,
    paymentStatus: response.paymentStatus,
  });
};

export const orderHistory = async (req, res) => {
  const userId = req.user.authClaims.id;
  const ordersData = await orderHistoryService(userId);
  if (!ordersData) {
    throw new expressError(404, "No order history found for the user");
  }
  return res.status(200).json({ status: 200, data: ordersData });
};
// Controller to get all orders (admin)
export const getAllOrder = async (req, res) => {
  const orders = await getAllOrderService();
  if (!orders || orders.length === 0) {
    throw new expressError(404, "No orders found");
  }
  return res.status(200).json({ status: 200, data: orders });
};
export const search = async (req, res) => {
  const { username, recipe, phone, address, status } = req.body;
  if (!username && !recipe && !phone && !address && !status) {
    throw new expressError(400, "At least one search parameter is required");
  }
  const response = await searchService(
    username,
    recipe,
    phone,
    address,
    status
  );
  if (!response || response.length === 0) {
    throw new expressError(404, "No matching orders found");
  }
  res.status(200).json({ status: 200, data: response });
};
