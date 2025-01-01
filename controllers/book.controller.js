import {
  addBook as addBookService,
  updateBook as updateBookService,
  updatePrice as updatePriceService,
  deleteBook as deleteBookService,
  getAllBook as getAllBookService,
  search as searchService,
  getRecentBook as getRecentBookService,
  updateDiscount as updateDiscountService,
  getSpecificBook as getSpecificBookService,
  exportToExcel as exportToExcelService,
} from "../service/book.service.js";
export const addBook = async (req, res) => {
  const validBook = req.validBook;
  const response = await addBookService(validBook);
  return res.status(200).json({ message: response });
};
export const updateBook = async (req, res) => {
  const { bookid } = req.headers;
  const response = await updateBookService(bookid, req.body);
  return res.status(200).json({ message: response });
};
export const updatePrice = async (req, res) => {
  const { bookid } = req.headers;
  const { price } = req.body;
  const response = await updatePriceService(bookid, price);
  return res.status(201).json({ message: response });
};
export const deleteBook = async (req, res) => {
  const { bookid } = req.headers;
  const response = await deleteBookService(bookid);
  return res.status(200).json({ message: response });
};
export const updateDiscount = async (req, res) => {
  const { bookid } = req.headers;
  const { discount } = req.body;
  const response = await updateDiscountService(bookid, discount);
  return res.status(201).json({ message: response });
};
export const getAllBook = async (req, res) => {
  const books = await getAllBookService();
  return res.status(200).json({ status: true, data: books });
};
export const search = async (req, res) => {
  const { title, price, author } = req.body;
  const response = await searchService(title, price, author);
  res.status(200).json({ response });
};
export const getRecentBook = async (req, res) => {
  const books = await getRecentBookService();
  return res.status(200).json({ status: "success", data: books });
};
export const getSpecificBook = async (req, res) => {
  const { id } = req.params;
  const book = await getSpecificBookService(id);
  return res.status(200).json({ status: "success", data: book });
};

