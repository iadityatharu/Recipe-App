import {
  addFavourite as addFavouriteService,
  removeFavourite as removeFavouriteService,
  displayAllFavourite as displayAllFavouriteService,
} from "../services/favourite.service.js";
export const addBookToFavourite = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { bookid } = req.headers;
  const response = await addFavouriteService(bookid, userId);
  return res.status(200).json({ message: response });
};
export const removeBookFromFavourite = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { bookid } = req.headers;
  const response = await removeFavouriteService(bookid, userId);
  return res.status(200).json({ message: response });
};
export const displayAllFavouriteBook = async (req, res) => {
  const userId = req.user.authClaims.id;
  const favouriteBooks = await displayAllFavouriteService(userId);
  return res.status(200).json({ status: true, data: favouriteBooks });
};
