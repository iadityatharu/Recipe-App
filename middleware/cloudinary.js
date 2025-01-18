import multer from "multer";
import { expressError } from "../utils/expressError.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";
// Multer configuration: use memory storage for file handling
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = fileTypes.test(
    file.originalname.split(".").pop().toLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)."));
  }
};
// Configure multer for image uploads
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter,
});
const uploadImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new expressError(400, "No image file provided for upload.");
    }

    const imageUrl = await imageUploadUtil(req.file.buffer);
    req.imageUrl = imageUrl;
    next();
  } catch (error) {
    next(error);
  }
};
export { upload, uploadImageHandler };
