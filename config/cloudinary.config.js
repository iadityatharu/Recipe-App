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
    console.log("File object received:", {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
    });

    // Validate file existence
    if (!file || !file.buffer) {
      throw new expressError(400, "No valid file provided for upload.");
    }

    // Define valid MIME types
    const validMimeTypes = [
      "image/jpeg", // Standard JPEG MIME type
      "image/jpg", // Alias for JPEG
      "image/png", // PNG images
      "image/gif", // GIF images
      "image/webp", // WebP images
    ];
    if (!file.mimetype || !validMimeTypes.includes(file.mimetype)) {
      throw new expressError(
        400,
        "Only JPEG, JPG, PNG, GIF, or WebP image files are allowed."
      );
    }
    const fallbackFilename = `image-${Date.now()}`;
    const originalName = file.originalname || `${fallbackFilename}.jpg`;
    const stream = streamifier.createReadStream(file.buffer);
    const uploadResult = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "recipe_images",
          public_id: `${Date.now()}-${fallbackFilename}`,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            return reject(
              new expressError(
                500,
                `Cloudinary upload failed: ${error.message}`
              )
            );
          }
          resolve(result);
        }
      );
      stream.pipe(cloudinaryStream);
    });

    return uploadResult.secure_url;
  } catch (error) {
    throw new expressError(500, `Error uploading image: ${error.message}`);
  }
};

export { imageUploadUtil };
