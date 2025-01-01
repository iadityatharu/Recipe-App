import User from "../model/user.model.js";
export const addFavourite = async (bookid, userId) => {
  const userData = await User.findById(userId);
  const isBookFavourite = userData.favourites.includes(bookid);
  if (isBookFavourite) {
    return "Book is already in favourite list";
  }
  await User.findByIdAndUpdate(userId, { $push: { favourites: bookid } });
  return "Book is added to favourites";
};
export const removeFavourite = async (bookid, userId) => {
  const userData = await User.findById(userId);
  const isBookFavourite = userData.favourites.includes(bookid);
  if (isBookFavourite) {
    await User.findByIdAndUpdate(userId, { $pull: { favourites: bookid } });
    return "Book removed from favourites";
  }
};
export const displayAllFavourite = async (userId) => {
  const userData = await User.findById(userId).populate("favourites");
  return userData.favourites;
};
