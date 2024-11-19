import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema(
  {
    url: {
      default:
        "https://asset.cloudinary.com/do5qodail/777c98c7b446fbccc0f9e45d9acbe8c2",
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      default: 0,
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    process: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Recipes = mongoose.model("Recipes", recipeSchema);
export default Recipes;
