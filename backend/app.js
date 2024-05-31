// Importing required modules
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnection from "./dataBase/db.js";
import fileupload from "express-fileupload";
import { errorMiddleware } from "./middleware/error.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postroute.js";

// Creating an Express application instance
const app = express();

// Loading environment variables from .env file
dotenv.config({ path: "./config/.env" });

// Middleware for enabling CORS
app.use(
  cors({
    origin: ["http://localhost:5173"], // Whitelisting allowed origins
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"], // Specifying allowed HTTP methods
    credentials: true, // Allowing credentials
  })
);

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for handling file uploads
app.use(
  fileupload({
    useTempFiles: true, // Storing uploaded files as temporary files
    tempFileDir: "/tmp/", // Directory for temporary files
  })
);

// Routes for user-related operations
app.use("/api/v1/user", userRoute);

// Routes for post-related operations
app.use("/api/v1/post", postRoute);

// Establishing connection to the database
dbConnection();

// Middleware for handling errors
app.use(errorMiddleware);

// Exporting the Express application instance
export default app;
