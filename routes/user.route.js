import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { validUser } from "../middleware/validate.js";
import { authentication } from "../middleware/authentication.js";
import { changePasswordCheck } from "../middleware/changePasswordCheck.js";
import {
  signup,
  signin,
  getUserInfo,
  updateAddress,
  search,
  logout,
  forgotPassword,
  changePassword,
  sendOtp,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
router.post("/signup", validUser, wrapAsync(signup));
router.post("/signin", wrapAsync(signin));
router.get("/get-user-information", authentication, wrapAsync(getUserInfo));
router.patch("/update-address", authentication, wrapAsync(updateAddress));
router.delete("/logout", authentication, wrapAsync(logout));
router.patch(
  "/change-password",
  authentication,
  changePasswordCheck,
  wrapAsync(changePassword)
);
router.post("/send-otp", wrapAsync(sendOtp));
router.post("/forgot-password", wrapAsync(forgotPassword));
router.get("/search", authentication, isAdmin, wrapAsync(search));
export default router;
