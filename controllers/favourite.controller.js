import {
  addFavourite as addFavouriteService,
  removeFavourite as removeFavouriteService,
  displayAllFavourite as displayAllFavouriteService,
} from "../services/favourite.service.js";
export const addRecipeToFavourite = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { recipeid } = req.params;
  const response = await addFavouriteService(recipeid, userId);
  return res.status(200).json({ status: 200, message: response });
};
export const removeRecipeFromFavourite = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { recipeid } = req.params;
  const response = await removeFavouriteService(recipeid, userId);
  return res.status(200).json({ status: 200, message: response });
};
export const displayAllFavouriteRecipe = async (req, res) => {
  const userId = req.user.authClaims.id;
  const favouriteRecipes = await displayAllFavouriteService(userId);
  return res.status(200).json({ status: 200, data: favouriteRecipes });
};
