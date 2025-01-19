import Order from "../model/order.model.js";

const isPurchased = async (req, res, next) => {
  try {
    const userId = req.user.authClaims.id;
    const recipeId = req.params.id;
    const order = await Order.findOne({ user: userId, recipe: recipeId });
    if (!order) {
      return res.status(403).json({
        message: "You have not purchased this recipe.",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default isPurchased;
