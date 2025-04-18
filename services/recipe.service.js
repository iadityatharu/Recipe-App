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
export const updateRecipe = async (id, updateData) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return { status: 404 };
  }
  Object.keys(updateData).forEach((key) => {
    recipe[key] = updateData[key];
  });
  await recipe.save();
  return recipe;
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
export const getSpecificRecipe = async (userId, recipeId, role) => {
  if (role === "admin") {
    const recipe = await Recipe.findById(recipeId);
    return { status: 200, data: recipe };
  }
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
export const getTotalRecipe = async () => {
  const count = await Recipe.countDocuments();
  if (count === 0) {
    return { status: 404, message: "No recipe found." };
  }
  return count;
};
