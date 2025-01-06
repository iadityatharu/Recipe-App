import express from "express";
import { authentication } from "../middleware/authentication.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
  addRecipe,
  deleteRecipe,
  getAllRecipe,
  getRecentRecipe,
  getSpecificRecipe,
  search,
  updateRecipe,
} from "../controllers/recipe.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import isPurchased from "../middleware/isPurchased.js";
const router = express.Router();
router.post(
  "/add-recipe",
  authentication,
  isAdmin,
  upload.array("images", 8),
  wrapAsync(addRecipe)
);
router.put("/update-recipe", authentication, isAdmin, wrapAsync(updateRecipe));
router.delete(
  "/delete-recipe",
  authentication,
  isAdmin,
  wrapAsync(deleteRecipe)
);
router.get("/get-all-recipe", wrapAsync(getAllRecipe));
router.get("/get-recent-recipe", wrapAsync(getRecentRecipe));
router.get("/search", authentication, wrapAsync(search));
router.get(
  "/get-recipe-by-id/:id",
  authentication,
  isPurchased,
  wrapAsync(getSpecificRecipe)
);
export default router;
