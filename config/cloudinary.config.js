import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { expressError } from "../utils/expressError.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const imageUploadUtil = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new expressError(400, "No valid file provided for upload.");
    }
    if (!file.mimetype.startsWith("image/")) {
      throw new expressError(400, "Only image files are allowed.");
    }
    const stream = streamifier.createReadStream(file.buffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "recipe_images",
            public_id: `${Date.now()}-${file.originalname}`, 
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              reject(
                new expressError(
                  500,
                  `Cloudinary upload failed: ${error.message}`
                )
              );
            } else {
              resolve(result);
            }
          }
        )
        .end(stream);
    });

    return uploadResult.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    throw new expressError(500, `Error uploading image: ${error.message}`);
  }
};
export { imageUploadUtil };
