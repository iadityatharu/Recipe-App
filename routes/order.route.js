import express from "express";
import { authentication } from "../middleware/authentication.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
  deleteOrder,
  getAllOrder,
  orderHistory,
  placeOrder,
  search,
  getTotalOrder,
  totalSale,
  monthlySale,
} from "../controllers/order.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
// place order
router.post("/place-order", authentication, wrapAsync(placeOrder));
// get order-history of particular user
router.get("/get-order-history", authentication, wrapAsync(orderHistory));
router.delete(
  "/delete-order/:id",
  authentication,
  isAdmin,
  wrapAsync(deleteOrder)
);

// get all orders ---admin
router.get("/get-all-order", authentication, isAdmin, wrapAsync(getAllOrder));
router.get("/search", authentication, isAdmin, wrapAsync(search));
router.get("/total-order", authentication, isAdmin, wrapAsync(getTotalOrder));
router.get("/total-sale", authentication, isAdmin, wrapAsync(totalSale));
router.get("/monthly-sale", authentication, isAdmin, wrapAsync(monthlySale));
export default router;
