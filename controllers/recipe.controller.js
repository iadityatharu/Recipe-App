import {
  addRecipe as addRecipeService,
  deleteRecipe as deleteRecipeService,
  getAllRecipe as getAllRecipeService,
  search as searchService,
  updateRecipe as updateRecipeService,
  getRecentRecipe as getRecentRecipeService,
  getSpecificRecipe as getSpecificRecipeService,
} from "../services/recipe.service.js";
import { expressError } from "../utils/expressError.js";
export const addRecipe = async (req, res) => {
  const { title, description, price, ingredients, process } = req.body;
  if (!title || !description || !price) {
    throw new expressError(400, "Title, description, and price are required.");
  }
  const imageUrl = req.imageUrl;
  if (!imageUrl) {
    throw new expressError(
      400,
      "Image upload failed. Please provide an image."
    );
  }
  const parsedIngredients = Array.isArray(ingredients)
    ? ingredients
    : JSON.parse(ingredients || "[]");
  const parsedProcess = Array.isArray(process)
    ? process
    : JSON.parse(process || "[]");
  if (!parsedIngredients.length) {
    throw new expressError(400, "Ingredients list cannot be empty.");
  }
  if (!parsedProcess.length) {
    throw new expressError(400, "Process steps cannot be empty.");
  }
  const recipeData = {
    title,
    description,
    price,
    ingredients: parsedIngredients,
    process: parsedProcess,
    images: imageUrl,
  };
  const response = await addRecipeService(recipeData);
  return res.status(201).json({
    status: 201,
    message: "Recipe added successfully!",
    data: response,
  });
};
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, ingredients, process } = req.body;

  if (!id) {
    throw new expressError(400, "Recipe ID is required.");
  }

  if (!title && !description && !price && !ingredients && !process) {
    throw new expressError(
      400,
      "At least one field must be provided to update."
    );
  }

  const parsedIngredients = ingredients
    ? Array.isArray(ingredients)
      ? ingredients
      : JSON.parse(ingredients || "[]")
    : undefined;

  const parsedProcess = process
    ? Array.isArray(process)
      ? process
      : JSON.parse(process || "[]")
    : undefined;

  if (parsedIngredients && !parsedIngredients.length) {
    throw new expressError(
      400,
      "Ingredients list cannot be empty if provided."
    );
  }

  if (parsedProcess && !parsedProcess.length) {
    throw new expressError(400, "Process steps cannot be empty if provided.");
  }

  const updateData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(price && { price }),
    ...(parsedIngredients && { ingredients: parsedIngredients }),
    ...(parsedProcess && { process: parsedProcess }),
  };

  const response = await updateRecipeService(id, updateData);
  if (response.status === 404) {
    throw new expressError(404, "Recipe not found.");
  }
  return res.status(200).json({
    status: 201,
    message: "Recipe updated successfully!",
  });
};

export const deleteRecipe = async (req, res) => {
  const { recipeid } = req.body;
  const response = await deleteRecipeService(recipeid);
  return res.status(200).json({ status: 200, message: response });
};
export const getAllRecipe = async (req, res) => {
  const recipes = await getAllRecipeService();
  return res.status(200).json({ status: true, data: recipes });
};
export const search = async (req, res) => {
  const { title, price } = req.query;
  try {
    const response = await searchService(title, price);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const getRecentRecipe = async (req, res) => {
  const recipes = await getRecentRecipeService();
  return res.status(200).json({ status: 200, data: recipes });
};
export const getSpecificRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.authClaims.id;
  const recipe = await getSpecificRecipeService(userId, id);
  return res.status(200).json({ status: 200, data: recipe.data });
};
