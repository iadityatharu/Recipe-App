import multer from "multer";
import { expressError } from "../utils/expressError.js";
import { imageUploadUtil } from "../config/cloudinary.config.js";
const storage = multer.memoryStorage();
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
