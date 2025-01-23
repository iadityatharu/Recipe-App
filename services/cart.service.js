import User from "../model/user.model.js";
export const addToCart = async (recipeid, userId) => {
  const userData = await User.findById(userId);
  const isBookInCart = userData.carts.includes(recipeid);
  if (isBookInCart) {
    return "Recipe already in cart";
  }
  await User.findByIdAndUpdate(id, {
    $push: { cart: bookid },
  });
  return "Recipe added to cart";
};
export const removeCart = async (recipeid, userId) => {
  await User.findByIdAndUpdate(userId, { $pull: { cart: recipeid } });
  return "Recipe removed from cart";
};
export const getAllCart = async (userId) => {
  const userData = await User.findById(userId).populate("carts");
  return userData.carts.reverse();
};
