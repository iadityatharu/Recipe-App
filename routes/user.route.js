import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { validUser } from "../middleware/validate.js";
import { authentication } from "../middleware/authentication.js";
import { changePasswordCheck } from "../middleware/changePasswordCheck.js";
import {
  signup,
  signin,
  getAllUsers,
  search,
  logout,
  getUserRole,
  forgotPassword,
  changePassword,
  deleteUser,
  sendOtp,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
router.post("/signup", validUser, wrapAsync(signup));
router.post("/signin", wrapAsync(signin));
router.delete("/logout", authentication, wrapAsync(logout));
router.patch(
  "/change-password",
  authentication,
  changePasswordCheck,
  wrapAsync(changePassword)
);
router.get("/get-user-role", authentication, wrapAsync(getUserRole));
router.post("/send-otp", wrapAsync(sendOtp));
router.get("/get-all-user", authentication, isAdmin, wrapAsync(getAllUsers));
router.post("/forgot-password", wrapAsync(forgotPassword));
router.get("/search", authentication, isAdmin, wrapAsync(search));
router.delete("/delete-user", authentication, isAdmin, wrapAsync(deleteUser));
export default router;
