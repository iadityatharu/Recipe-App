import multer from "multer";
import { expressError } from "../utils/expressError.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";

import path from "path"; // Add this line to import the path module

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/; // Allowed file types
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter,
});

const uploadImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new expressError(404, "No image file provided for upload.");
    }

    // Pass the complete `req.file` object to `imageUploadUtil`
    const imageUrl = await imageUploadUtil(req.file);
    req.imageUrl = imageUrl; // Attach the uploaded image URL to the request object
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, uploadImageHandler };
