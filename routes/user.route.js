import express from "express";
import { wrapAsync } from "../util/wrapAsync.js";
import { validUser } from "../middleware/validate.js";
import { authentication } from "../middleware/userAuth.js";
import { changePasswordCheck } from "../middleware/changePasswordCheck.js";
import {
  signup,
  signin,
  getUserInfo,
  updateAddress,
  search,
  exportToExcel,
  generateToken,
  logout,
  forgotPassword,
  changePassword,
  sendOtp,
} from "../controller/user.controller.js";
import { checkRefreshToken } from "../middleware/checkRefreshToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
router.post("/signup", validUser, wrapAsync(signup));
router.post("/signin", wrapAsync(signin));
router.get("/get-user-information", authentication, wrapAsync(getUserInfo));
router.patch("/update-address", authentication, wrapAsync(updateAddress));
router.post("/refresh-token", checkRefreshToken, wrapAsync(generateToken));
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
router.get("/download-excel", authentication, wrapAsync(exportToExcel));
export default router;
