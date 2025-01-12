import {
  addRecipe as addRecipeService,
  updateRecipe as updateRecipeService,
  deleteRecipe as deleteRecipeService,
  getAllRecipe as getAllRecipeService,
  search as searchService,
  getRecentRecipe as getRecentRecipeService,
  getSpecificRecipe as getSpecificRecipeService,
} from "../services/recipe.service.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";
export const addRecipe = async (req, res) => {
  const { title, description, price, ingredients, process, images } = req.body;
  const uploadedFile = req.file;
  if (!title || !description || !price) {
    return res
      .status(400)
      .json({ message: "Title, description, and price are required." });
  }
  let imageUrls = [];
  if (uploadedFile) {
    try {
      const uploadedImageUrl = await imageUploadUtil(uploadedFile);
      imageUrls.push(uploadedImageUrl);
    } catch (error) {
      console.error("[addRecipe] Error uploading image:", error.message);
      return res
        .status(400)
        .json({ message: `Image upload failed: ${error.message}` });
    }
  }

  if (images) {
    const providedImageUrls = Array.isArray(images) ? images : [images];
    imageUrls = [...imageUrls, ...providedImageUrls];
  }

  const parsedIngredients = ingredients
    ? Array.isArray(ingredients)
      ? ingredients
      : JSON.parse(ingredients)
    : [];
  const parsedProcess = process
    ? Array.isArray(process)
      ? process
      : JSON.parse(process)
    : [];
  const validRecipe = {
    title,
    description,
    price,
    ingredients: parsedIngredients,
    process: parsedProcess,
    images: imageUrls,
  };
  const response = await addRecipeService(validRecipe);
  return res
    .status(200)
    .json({ message: "Recipe added successfully", data: response });
};
export const updateRecipe = async (req, res) => {
  const { recipeid } = req.headers;
  const response = await updateRecipeService(recipeid, req.body);
  return res.status(200).json({ message: response });
};
export const deleteRecipe = async (req, res) => {
  const { recipeid } = req.headers;
  const response = await deleteRecipeService(recipeid);
  return res.status(200).json({ message: response });
};
export const getAllRecipe = async (req, res) => {
  const recipes = await getAllRecipeService();
  return res.status(200).json({ status: true, data: recipes });
};
export const search = async (req, res) => {
  const { title, price } = req.body;
  const response = await searchService(title, price);
  res.status(200).json({ response });
};
export const getRecentRecipe = async (req, res) => {
  const recipes = await getRecentRecipeService();
  return res.status(200).json({ status: "success", data: recipes });
};
export const getSpecificRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await getSpecificRecipeService(id);
  return res.status(200).json({ status: "success", data: recipe });
};
