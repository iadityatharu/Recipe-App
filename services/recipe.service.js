import Recipe from "../model/recipe.model.js";
export const addRecipe = async (recipeData) => {
  const { title, description, price, process, images } = recipeData;
  const recipe = new Recipe({
    title,
    price,
    description,
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
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  return recipes;
};
export const search = async (title, price) => {
  const response = await Recipe.find({
    $or: [{ title: title }, { price: price }],
  }).select("-createdAt -updatedAt");
  return response;
};
export const getRecentRecipe = async () => {
  const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(4);
  return recipes;
};
export const getSpecificRecipe = async (id) => {
  const recipe = await Recipe.findById(id);
  return recipe;
};
