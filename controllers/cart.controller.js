import {
  addToCart as addToCartService,
  removeCart as removeCartService,
  getAllCart as getAllCartService,
} from "../services/cart.service.js";

export const addToCart = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { recipeid } = req.params;
  const response = await addToCartService(recipeid, userId);
  return res.status(200).json({ message: response });
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.authClaims.id;
  const { recipeid } = req.params;
  const response = await removeCartService(recipeid, userId);
  return res.status(200).json({ message: response });
};

export const getAllCart = async (req, res) => {
  const userId = req.user.authClaims.id;
  const cart = await getAllCartService(userId);
  return res.status(200).json({ data:cart });
};
