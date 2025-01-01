import Recipe from "../model/recipe.model.js";
export const addRecipe = async (recipeData) => {
  const recipe = new Recipe({
    url: recipeData.url,
    title: recipeData.title,
    price: recipeData.price,
    description: recipeData.description,
    process: recipeData.process,
  });
  await recipe.save();

  return "Recipe added successfully";
};
export const updateRecipe = async (recipeId, recipeData) => {
  await Recipe.findByIdAndUpdate(recipeId, {
    url: recipeData.url,
    title: recipeData.title,
    author: recipeData.author,
    price: recipeData.price,
    description: recipeData.description,
    languages: recipeData.languages,
  });
  return "Recipe Updated successfully";
};
export const updatePrice = async (recipeId, price) => {
  await Recipe.findByIdAndUpdate(recipeId, { price });
  return { message: "Price Updated Successfully" };
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
