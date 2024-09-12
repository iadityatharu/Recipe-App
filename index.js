import express from "express";
import DB from "./connection/db.js";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
dotenv.config();
DB();

app.use(cors());
app.use(express.json());

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
