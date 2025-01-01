import {
  addRecipe as addRecipeService,
  updateRecipe as updateRecipeService,
  updatePrice as updatePriceService,
  deleteRecipe as deleteRecipeService,
  getAllRecipe as getAllRecipeService,
  search as searchService,
  getRecentRecipe as getRecentRecipeService,
  getSpecificRecipe as getSpecificRecipeService,
} from "../services/recipe.service.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";
export const addRecipe = async (req, res) => {
  const { title, description, price, ingredients, steps } = req.body;
  // Handle image uploads (if any)
  const uploadedImages = req.files; // Files are attached via the 'images' field in the form
  let imageUrls = [];
  if (uploadedImages && uploadedImages.length > 0) {
    // Upload images to Cloudinary and get their URLs
    imageUrls = await imageUploadUtil(uploadedImages);
  }
  const validRecipe = {
    title,
    description,
    price,
    ingredients,
    steps,
    images: imageUrls, // Add the Cloudinary image URLs to the recipe
  };
  const response = await addRecipeService(validRecipe);
  return res.status(200).json({ message: response });
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
