import cloudinary from "cloudinary";
import multer from "multer";
import { expressError } from "../utils/expressError.js";
// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new expressError(
          400,
          "Unsupported file type. Only JPG, PNG, and WEBP are allowed."
        )
      );
    }
  },
});

// Image upload utility
const imageUploadUtil = async (files) => {
  try {
    if (files.length > 8) {
      throw new expressError(400, "You can only upload a maximum of 8 images.");
    }
    const uploadPromises = files.map((file) =>
      cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto" },
        file.buffer
      )
    );
    const results = await Promise.all(uploadPromises);
    const urls = results.map((result) => result.secure_url);
    return urls;
  } catch (error) {
    throw new expressError(
      400,
      `Unable to upload image. Error: ${error.message}`
    );
  }
};

export { upload, imageUploadUtil };
