// ======================================================
// CORE IMPORTS
// ======================================================

import express from "express";
import { config } from "dotenv";

// ======================================================
// MIDDLEWARES
// ======================================================

import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

// ======================================================
// DATABASE INIT
// ======================================================

import { createTable } from "./utils/createTables.js";

// ======================================================
// ERROR HANDLING
// ======================================================

import { errorMiddleware } from "./middlewares/errorMiddleware.js";

// ======================================================
// ROUTES
// ======================================================

import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";


// ======================================================
// APP INITIALIZATION
// ======================================================

const app = express();


// ======================================================
// ENV CONFIG
// ======================================================

config({ path: "./config/config.env" });


// ======================================================
// CORS CONFIG
// ======================================================

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// ======================================================
// GLOBAL MIDDLEWARES
// ======================================================

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);


// ======================================================
// ROUTES
// ======================================================

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);


// ======================================================
// DATABASE INIT CALL
// ======================================================

// NOTE: In production, better to run this separately (migration script)
createTable();


// ======================================================
// ERROR HANDLER (LAST MIDDLEWARE)
// ======================================================

app.use(errorMiddleware);


// ======================================================
// EXPORT APP
// ======================================================

export default app;