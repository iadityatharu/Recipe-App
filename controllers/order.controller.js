import {
  placeOrder as placeOrderService,
  orderHistory as orderHistoryService,
  getAllOrder as getAllOrderService,
  updateOrder as updateOrderService,
  search as searchService,
  exportToExcel as exportToExcelService,
} from "../service/order.service.js";
import excelJS from "exceljs";
import { expressError } from "../util/expressError.js";
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
  const response = await searchService(username, recipe, phone, address, status);
  res.status(200).json({ response });
};
export const exportToExcel = async (req, res) => {
  const response = await exportToExcelService();
  if (!response) {
    throw new expressError(404, "No Data Found!");
  }
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Orders");
  worksheet.columns = [
    { header: "S no.", key: "s_no", width: 5 },
    { header: "Username", key: "username", width: 20 },
    { header: "Address", key: "address", width: 20 },
    { header: "Phone", key: "phone", width: 10 },
    { header: "Book", key: "book", width: 15 },
    { header: "Total", key: "total", width: 8 },
    { header: "Discount", key: "key", width: 8 },
    { header: "Status", key: "status", width: 10 },
  ];
  let counter = 1;
  response.forEach((order) => {
    order.s_no = counter;
    worksheet.addRow(order);
    counter++;
  });
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);
  return workbook.xlsx.write(res).then(() => {
    res.status(200).json({ message: "Download successfull" });
  });
};
