import {
  placeOrder as placeOrderService,
  orderHistory as orderHistoryService,
  getAllOrder as getAllOrderService,
  updateOrder as updateOrderService,
  search as searchService,
} from "../services/order.service.js";
export const placeOrder = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { order } = req.body;
  const response = await placeOrderService(userId, order);
  return res.status(200).json({ status: true, message: response.message });
};
export const orderHistory = async (req, res) => {
  const userId = req.user.authClaims.id;
  const ordersData = await orderHistoryService(userId);
  return res.status(200).json({ status: true, data: ordersData });
};
// Controller to get all orders (admin)
export const getAllOrder = async (req, res) => {
  const userData = await getAllOrderService();
  return res.status(200).json({ status: true, order: userData });
};
// Controller to update order status (admin)
export const updateOrderAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const response = await updateOrderService(id, status);
  return res.status(200).json({ message: response.message });
};
export const search = async (req, res) => {
  const { username, recipe, phone, address, status } = req.body;
  const response = await searchService(
    username,
    recipe,
    phone,
    address,
    status
  );
  res.status(200).json({ response });
};
