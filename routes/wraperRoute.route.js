import express from "express";
import userRoute from "./user.route.js";
import favouriteRoute from "./favourite.route.js";
import orderRoute from "./order.route.js";
import recipeRoute from "./recipe.route.js";
import cartRoute from "./cart.route.js";

const router = express.Router();
router.use("/user", userRoute);
router.use("/favourite", favouriteRoute);
router.use("/order", orderRoute);
router.use("/recipe", recipeRoute);
router.use("/cart", cartRoute);
export default router;
