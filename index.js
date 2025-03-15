import dotenv from "dotenv";
// Load environment variables from .env
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import limitter from "express-rate-limit";
import { connection } from "./config/connection.config.js";
import { expressError } from "./utils/expressError.js";
import { missingVar } from "./function/checkEnv.js";
import indexRoute from "./routes/wraperRoute.route.js";
const app = express();
//calling the function that check the env variable are available
missingVar();
//middlewar
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const rateLimit = limitter({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 200, // Limit 40 requests per IP
  handler: (req, res) => {
    res.status(429).json({
      message: `Too many requests from IP: ${req.ip}`,
    });
  },
});
app.use("/api/v1", rateLimit);
//all routes
app.use("/api/v1/", indexRoute);
// Handle 404 errors
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});
// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  // console.error(`Error: ${message}, Status Code: ${status}`, err);
  res.status(status).json({ message });
});
// Establish database connection
connection();
// Start server
const PORT = process.env.PORT || 5431;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
