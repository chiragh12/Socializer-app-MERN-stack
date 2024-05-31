// Importing required modules
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
  // Extracting JWT token from cookies
  const { token } = req.cookies;

  // If token is not present, user is not authenticated
  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 400));
  }

  try {
    // Verifying the JWT token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Finding user by ID extracted from decoded token
    req.user = await User.findById(decoded.id);

    // Proceeding to the next middleware
    next();
  } catch (error) {
    // If token verification fails, user is not authenticated
    return next(new ErrorHandler("User is not authenticated", 400));
  }
};
