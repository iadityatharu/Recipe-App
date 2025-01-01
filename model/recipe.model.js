import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
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
    images: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);
const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
