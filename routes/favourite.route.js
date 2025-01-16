import express from "express";
import { authentication } from "../middleware/authentication.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import {
  addRecipeToFavourite,
  displayAllFavouriteRecipe,
  removeRecipeFromFavourite,
} from "../controllers/favourite.controller.js";
const router = express.Router();
// add recipe to favourite
router.put(
  "/add-recipe-to-favourite/:id",
  authentication,
  wrapAsync(addRecipeToFavourite)
);
// remove recipe from favourite
router.put(
  "/remove-recipe-from-favourite/:id",
  authentication,
  wrapAsync(removeRecipeFromFavourite)
);
// display all favourite recipes
router.get(
  "/get-favourite-recipe",
  authentication,
  wrapAsync(displayAllFavouriteRecipe)
);
export default router;
