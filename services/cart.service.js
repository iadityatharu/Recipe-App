import User from "../model/user.model.js";
export const addToCart = async (recipeid, userId) => {
  const userData = await User.findById(userId);
  const isRecipeInCart = userData.carts.includes(recipeid);
  if (isRecipeInCart) {
    return "Recipe already in cart";
  }
  await User.findByIdAndUpdate(userId, {
    $push: { carts: recipeid },
  });
  return "Recipe added to cart";
};
export const removeCart = async (recipeid, userId) => {
  await User.findByIdAndUpdate(userId, { $pull: { carts: recipeid } });
  return "Recipe removed from cart";
};
export const getAllCart = async (userId) => {
  const userData = await User.findById(userId).populate("carts");
  console.log(userData.carts);
  return userData.carts;
};
