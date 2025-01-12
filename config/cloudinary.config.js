import multer from "multer";
import { imageUploadUtil } from "../config/cloudinary.config.js";
import { expressError } from "../utils/expressError.js";

// Configure Multer storage (memory storage for file buffer)
const storage = multer.memoryStorage();

// Set up Multer middleware for single image upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
const uploadImageHandler = async (req, res, next) => {
  try {
    const uploadedFile = req.file;
    if (!uploadedFile) {
      throw new expressError(400, "No image file provided for upload.");
    }
    const imageUrl = await imageUploadUtil(uploadedFile);
    req.imageUrl = imageUrl;
    next();
  } catch (error) {
    next(error);
  }
};

export { upload, uploadImageHandler };
