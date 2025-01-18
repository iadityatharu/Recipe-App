import multer from "multer";
import { expressError } from "../utils/expressError.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";

// Multer configuration: use memory storage for file handling
const storage = multer.memoryStorage(); // Temporarily store files in memory

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/; // Allowed file types
  const extname = fileTypes.test(
    file.originalname.split(".").pop().toLowerCase()
  ); // Validate file extension
  const mimetype = fileTypes.test(file.mimetype); // Validate MIME type

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

// Middleware to handle image upload and pass URL to the request object
const uploadImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new expressError(400, "No image file provided for upload.");
    }

    // Use the buffer from multer to upload directly to Cloudinary
    const imageUrl = await imageUploadUtil(req.file.buffer); // Ensure `imageUploadUtil` supports buffer input
    req.imageUrl = imageUrl; // Attach the uploaded image URL to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    next(error); // Forward the error to the error-handling middleware
  }
};

export { upload, uploadImageHandler };
