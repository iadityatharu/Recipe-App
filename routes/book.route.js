import express from "express";
import { authentication } from "../middleware/userAuth.js";
import { wrapAsync } from "../util/wrapAsync.js";
import {
  addBook,
  deleteBook,
  getAllBook,
  getRecentBook,
  getSpecificBook,
  updatePrice,
  updateDiscount,
  search,
  updateBook,
  exportToExcel,
} from "../controller/book.controller.js";
import { validBook } from "../middleware/validate.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
// add book
router.post(
  "/add-book",
  authentication,
  validBook,
  isAdmin,
  wrapAsync(addBook)
);
router.put("/update-book", authentication, isAdmin, wrapAsync(updateBook));
router.patch("/update-price", authentication, isAdmin, wrapAsync(updatePrice));
router.delete("/delete-book", authentication, isAdmin, wrapAsync(deleteBook));
router.patch(
  "/update-discount",
  authentication,
  isAdmin,
  wrapAsync(updateDiscount)
);
router.get("/get-all-book", wrapAsync(getAllBook));
router.get("/get-recent-book", wrapAsync(getRecentBook));
router.get("/search", authentication, wrapAsync(search));
router.get("/get-book-by-id/:id", wrapAsync(getSpecificBook));
export default router;
