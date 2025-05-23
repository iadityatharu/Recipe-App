import express from "express";
import { authentication } from "../middleware/authentication.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
  addToCart,
  removeFromCart,
  getAllCart,
} from "../controllers/cart.controller.js";
const router = express.Router();
router.put("/add-to-cart/:recipeid", authentication, wrapAsync(addToCart));
router.put(
  "/remove-recipe-from-cart/:recipeid",
  authentication,
  wrapAsync(removeFromCart)
);
// get a cart of particular user
router.get("/get-user-cart", authentication, wrapAsync(getAllCart));
export default router;
