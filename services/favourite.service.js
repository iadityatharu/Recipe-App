import User from "../model/user.model.js";
export const addFavourite = async (recipeid, userId) => {
  const userData = await User.findById(userId);
  const isRecipeFavourite = userData.favourites.includes(recipeid);
  if (isRecipeFavourite) {
    return "Recipe is already in favourite list";
  }
  await User.findByIdAndUpdate(userId, { $push: { favourites: recipeid } });
  return "Recipe is added to favourites";
};
export const removeFavourite = async (recipeid, userId) => {
  const userData = await User.findById(userId);
  const isRecipeFavourite = userData.favourites.includes(recipeid);
  if (isRecipeFavourite) {
    await User.findByIdAndUpdate(userId, { $pull: { favourites: recipeid } });
    return "Recipe removed from favourites";
  }
};
// export const displayAllFavourite = async (userId) => {
//   const userData = await User.findById(userId).populate("favourites");
//   return userData.favourites;
// };

export const displayAllFavourite = async (userId) => {
  const userData = await User.findById(userId).populate({
    path: "favourites",
    select: "title price images",
  });
  return userData.favourites;
};
