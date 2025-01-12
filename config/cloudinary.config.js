import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { expressError } from "../utils/expressError.js"; // Assuming you have this error handler

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image upload utility for a single file
const imageUploadUtil = async (file) => {
  try {
    if (!file) {
      throw new expressError(400, "No file provided for upload.");
    }

    console.log("file received for upload:", file);

    // Convert the file buffer into a readable stream
    const stream = streamifier.createReadStream(file.buffer);

    // Upload the stream to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { resource_type: "auto", folder: "recipe_images" }, // Organize images in a specific folder
          (error, result) => {
            if (error) {
              reject(
                new Error(
                  `Failed to upload ${file.originalname}: ${error.message}`
                )
              );
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(stream);
    });

    return result; // Return the uploaded image URL
  } catch (error) {
    throw new expressError(400, `Image upload failed: ${error.message}`);
  }
};

export { imageUploadUtil };
