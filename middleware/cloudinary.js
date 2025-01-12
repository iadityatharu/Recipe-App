import multer from "multer";
import { expressError } from "../utils/expressError.js";
import { imageUploadUtil } from "../config/cloudinary.config.js"; // Assumes Cloudinary is configured in this file

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Set up Multer middleware for single image upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new expressError(
          400,
          "Invalid file type. Only JPEG, PNG, and GIF are allowed."
        )
      );
    }
    cb(null, true);
  },
}).single("image");

// Middleware for uploading the image to Cloudinary
const uploadImageHandler = async (req, res, next) => {
  try {
    const uploadedFile = req.file;

    // Check if a file was uploaded
    if (!uploadedFile) {
      throw new expressError(400, "No image file provided for upload.");
    }

    // Upload the image to Cloudinary
    const imageUrl = await imageUploadUtil(uploadedFile);

    // Attach the uploaded image URL to the request object
    req.imageUrl = imageUrl;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, uploadImageHandler };
