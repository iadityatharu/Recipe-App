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
          name: { type: String, required: true }, // Ingredient name
          quantity: { type: Number, required: true }, // Quantity of the ingredient
          unit: { type: String, required: true }, // Unit of measurement (e.g., grams, cups)
        },
      ],
      required: true,
    },
    process: {
      type: [
        {
          step_number: { type: Number, required: true }, // Step number for ordering
          description: { type: String, required: true }, // Detailed description of the step
        },
      ],
      required: true,
    },
    images: {
      type: [String], // URLs or paths to recipe images
      required: false,
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
