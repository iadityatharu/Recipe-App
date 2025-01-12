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
  const { title, description, price, ingredients, process } = req.body;
  const uploadedImages = req.files;
  let imageUrls = [];
  if (uploadedImages && uploadedImages.length > 0) {
    // Upload images to Cloudinary and get their URLs
    imageUrls = await imageUploadUtil(uploadedImages);
  } else {
    imageUrls = [
      "https://www.gettyimages.com/detail/photo/men-eating-vegan-creamy-roasted-pumpkin-soup-royalty-free-image/1197494143",
    ];
  }
  const validRecipe = {
    title,
    description,
    price,
    ingredients,
    process,
    images: imageUrls,
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
