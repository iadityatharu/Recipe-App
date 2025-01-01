import {
  addRecipe as addRecipeService,
  updateRecipe as updateRecipeService,
  updatePrice as updatePriceService,
  deleteRecipe as deleteRecipeService,
  getAllRecipe as getAllRecipeService,
  search as searchService,
  getRecentRecipe as getRecentRecipeService,
  getSpecificRecipe as getSpecificRecipeService,
} from "../service/book.service.js";
export const addRecipe = async (req, res) => {
  const validBook = req.validBook;
  const response = await addRecipeService(validBook);
  return res.status(200).json({ message: response });
};
export const updateRecipe = async (req, res) => {
  const { recipeid } = req.headers;
  const response = await updateRecipeService(recipeid, req.body);
  return res.status(200).json({ message: response });
};
export const updatePrice = async (req, res) => {
  const { recipeid } = req.headers;
  const { price } = req.body;
  const response = await updatePriceService(recipeid, price);
  return res.status(201).json({ message: response });
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
  const { title, price, chef } = req.body;
  const response = await searchService(title, price, chef);
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
