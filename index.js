import dotenv from "dotenv";
// Load environment variables from .env
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./config/connection.config.js";
import { expressError } from "./utils/expressError.js";
import { missingVar } from "./function/checkEnv.js";
import indexRoute from "./routes/index.route.js";
const app = express();
