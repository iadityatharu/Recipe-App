import Order from "../model/order.model.js";

const isPurchased = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recipeId = req.params.recipeId;
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
