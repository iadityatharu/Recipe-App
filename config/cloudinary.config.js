import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { expressError } from "../utils/expressError.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Utility function to upload an image to Cloudinary
const imageUploadUtil = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new expressError(400, "No valid file provided for upload.");
    }

    // Create a readable stream from the file buffer
    const stream = streamifier.createReadStream(file.buffer);

    // Upload the stream to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "image", // Ensure the resource type is "image"
            folder: "recipe_images", // Folder name in Cloudinary for organization
            public_id: file.originalname, // Use the original file name as public ID
            overwrite: true, // Optional: Overwrite if a file with the same name exists
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
