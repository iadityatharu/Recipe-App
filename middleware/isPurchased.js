import Order from "../model/order.model.js"; // Adjust the path to your Order model

const isPurchased = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recipeId = req.params.recipeId;
    // Check if an order exists with the specified user and recipe
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

export default checkRecipePurchase;
