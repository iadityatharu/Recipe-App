import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { expressError } from "../utils/expressError.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUploadUtil = async (buffer) => {
  try {
    const result = await cloudinary.uploader.upload_stream({
      resource_type: "image",
    });

    // Use a stream to upload the buffer
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        throw new Error(error.message);
      }
      return result.secure_url; // Return the secure URL of the uploaded image
    });
    stream.end(buffer); // Send the buffer data to the stream
  } catch (error) {
    throw new Error("Image upload to Cloudinary failed.");
  }
};
export { imageUploadUtil };
