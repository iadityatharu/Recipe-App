import cloudinary from "cloudinary";
import multer from "multer";
import { expressError } from "../utils/expressError.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const imageUploadUtil = async (files) => {
  try {
    if (files.length > 8) {
      throw new expressError(400, "You can only upload a maximum of 8 images.");
    }
    const uploadPromises = files.map((file) =>
      cloudinary.v2.uploader.upload(file.buffer, {
        resource_type: "auto",
      })
    );
    const results = await Promise.all(uploadPromises);
    const urls = results.map((result) => result.secure_url);
    return urls;
  } catch (error) {
    throw new expressError(400, "Unable to upload image.");
  }
};

