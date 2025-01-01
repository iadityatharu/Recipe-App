import express from "express";
import userRoute from "./user.route.js";
import favouriteRoute from "./favourite.route.js";

const router = express.Router();
router.use("/user", userRoute);
router.use("/favourite", favouriteRoute);

export default router;
