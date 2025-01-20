import Recipe from "../model/recipe.model.js";
import Order from "../model/order.model.js";
export const addRecipe = async (recipeData) => {
  const { title, description, price, ingredients, process, images } =
    recipeData;
  const recipe = new Recipe({
    title,
    description,
    price,
    ingredients,
    process,
    images,
  });
  await recipe.save();
  return "Recipe added successfully";
};
export const updateRecipe = async (recipeId, recipeData) => {
  const { title, description, price, process, images } = recipeData;
  await Recipe.findByIdAndUpdate(recipeId, {
    title,
    price,
    description,
    process,
    images,
  });
  return "Recipe updated successfully";
};
export const deleteRecipe = async (recipeId) => {
  await Recipe.findByIdAndDelete(recipeId);
  return "Recipe Deleted successfully";
};
export const getAllRecipe = async () => {
  const recipes = await Recipe.find()
    .select("_id images title price")
    .sort({ createdAt: -1 });
  return recipes;
};
// export const search = async (title, price) => {
//   const response = await Recipe.find({
//     $or: [{ title: title }, { price: price }],
//   }).select("-createdAt -updatedAt");
//   return response;
// };
export const search = async (title, price) => {
  const query = {};
  if (title) query.title = { $regex: title, $options: "i" };
  if (price) query.price = price;
  const response = await Recipe.find(query).select("-createdAt -updatedAt");
  return response;
};

export const getRecentRecipe = async () => {
  const recipes = await Recipe.find()
    .select("_id images title price")
    .sort({ createdAt: -1 })
    .limit(4);
  return recipes;
};
export const getSpecificRecipe = async (userId, recipeId) => {
  const order = await Order.findOne({
    user: userId,
    recipe: recipeId,
    status: "purchased",
  });
  if (!order) {
    return {
      status: 404,
      message: "Order not found or payment not completed.",
    };
  }
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return { status: 404, message: "Recipe not found." };
  }

  return { status: 200, data: recipe };
};
