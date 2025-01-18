import multer from "multer";
import { expressError } from "../utils/expressError.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";

// Multer configuration (no local storage)
const storage = multer.memoryStorage(); // Store files in memory temporarily
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/; // Allowed file types
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

    // Use the buffer directly to upload to Cloudinary
    const imageUrl = await imageUploadUtil(req.file.buffer); // Update `imageUploadUtil` to handle file buffers
    req.imageUrl = imageUrl; // Attach the uploaded image URL to the request object
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, uploadImageHandler };
