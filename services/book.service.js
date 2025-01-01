import Book from "../model/book.model.js";
export const addBook = async (bookData) => {
  const book = new Book({
    url: bookData.url,
    title: bookData.title,
    author: bookData.author,
    discount: bookData.discount,
    price: bookData.price,
    description: bookData.description,
    languages: bookData.languages,
  });
  await book.save();

  return "Book added successfully";
};
export const updateBook = async (bookId, bookData) => {
  await Book.findByIdAndUpdate(bookId, {
    url: bookData.url,
    title: bookData.title,
    author: bookData.author,
    price: bookData.price,
    description: bookData.description,
    languages: bookData.languages,
  });
  return "Book Updated successfully";
};
export const updatePrice = async (bookId, price) => {
  await Book.findByIdAndUpdate(bookId, { price });
  return { message: "Price Updated Successfully" };
};
export const deleteBook = async (bookId) => {
  await Book.findByIdAndDelete(bookId);
  return "Book Deleted successfully";
};
export const updateDiscount = async (bookId, discount) => {
  await Book.findByIdAndUpdate(bookId, { discount });
  return { message: "Discount Updated successfully" };
};
export const getAllBook = async () => {
  const books = await Book.find().sort({ createdAt: -1 });
  return books;
};
export const search = async (title, price, author) => {
  const response = await Book.find({
    $or: [{ title: title }, { price: price }, { author: author }],
  }).select("-createdAt -updatedAt");
  return response;
};
export const getRecentBook = async () => {
  const books = await Book.find().sort({ createdAt: -1 }).limit(4);
  return books;
};
export const getSpecificBook = async (id) => {
  const book = await Book.findById(id);
  return book;
};
