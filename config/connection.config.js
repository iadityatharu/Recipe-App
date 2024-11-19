import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_DB = process.env.MONGO_URL;

const conn = async () => {
  try {
    await mongoose.connect(MONGO_DB);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
export default conn;
