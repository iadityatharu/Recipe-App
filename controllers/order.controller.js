import {
  placeOrder as placeOrderService,
  orderHistory as orderHistoryService,
  getAllOrder as getAllOrderService,
  search as searchService,
  deleteOrder as deleteOrderService,
  getTotalOrder as getTotalOrderService,
} from "../services/order.service.js";
import { expressError } from "../utils/expressError.js";
export const placeOrder = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { recipeId, paymentMethodId } = req.body;
  if (!recipeId || !paymentMethodId) {
    return res.status(400).json({
      status: 400,
      message: "Recipe IDs and Payment Method ID are required",
    });
  }
  // Split the comma-separated recipeIds string into an array
  const recipeIdsArray = recipeId.split(",");

  if (!Array.isArray(recipeIdsArray) || recipeIdsArray.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid recipe IDs format",
    });
  }

  try {
    // Process each recipe order in parallel
    const orderResponses = await Promise.all(
      recipeIdsArray.map((recipeId) =>
        placeOrderService(userId, recipeId, paymentMethodId)
      )
    );

    return res.status(200).json({
      status: 200,
      message: "Orders placed successfully",
      orders: orderResponses.map((response, index) => ({
        recipeId: recipeIdsArray[index],
        orderId: response.orderId,
        paymentStatus: response.paymentStatus,
        message: response.message,
      })),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
};

export const orderHistory = async (req, res) => {
  const userId = req.user.authClaims.id;
  const ordersData = await orderHistoryService(userId);
  if (!ordersData) {
    throw new expressError(404, "No order history found for the user");
  }
  return res.status(200).json({ status: 200, data: ordersData });
};
export const getAllOrder = async (req, res) => {
  const orders = await getAllOrderService();
  if (!orders || orders.length === 0) {
    throw new expressError(404, "No orders found");
  }
  return res.status(200).json({ status: 200, data: orders });
};
export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    throw new expressError(404, "Order id required");
  }
  const response = await deleteOrderService(orderId);
  return res.status(200).json({ message: response });
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
export const getTotalOrder = async (req, res) => {
  const response = await getTotalOrderService();
  if (!response) {
    throw new expressError(404, "No orders found");
  }
  return res.status(200).json({ status: 200, data: response });
};
