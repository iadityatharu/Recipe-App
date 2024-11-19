import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURL = process.env.MONGO_URL;
export const connection = () => {
  try {
    return mongoose
      .connect(dbURL)
      .then(console.log("Database connected successfully"));
  } catch (error) {
    console.log(error);
  }
};
