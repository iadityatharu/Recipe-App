import express from "express";
import { authentication } from "../middleware/authentication.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
  getAllOrder,
  orderHistory,
  placeOrder,
  search,
} from "../controllers/order.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
// place order
router.post("/place-order", authentication, wrapAsync(placeOrder));
// get order-history of particular user
router.get("/get-order-history", authentication, wrapAsync(orderHistory));

// get all orders ---admin
router.get("/get-all-order", authentication, isAdmin, wrapAsync(getAllOrder));
router.get("/search", authentication, isAdmin, wrapAsync(search));
export default router;
