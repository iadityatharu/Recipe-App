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
    ingredients: {
      type: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          unit: { type: String, required: true }, // Unit of measurement (example, grams, cups)
        },
      ],
      required: true,
    },
    process: {
      type: [
        {
          step_number: { type: Number, required: true },
          description: { type: String, required: true }, 
        },
      ],
      required: true,
    },
    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
