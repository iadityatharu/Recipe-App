import cloudinary from "cloudinary";
import { expressError } from "../utils/expressError.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUploadUtil = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "recipes" },
      (error, result) => {
        if (error) {
          reject(
            new expressError(400, "Failed to upload image to Cloudinary.")
          );
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(imageBuffer); 
  });
};

export { imageUploadUtil };
