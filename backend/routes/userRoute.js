// Importing required modules
import express from "express";
import { isAuthenticated } from "../middleware/auth.js"; // Importing isAuthenticated middleware
import {
  updateUserProfile,
  currentUserProfile,
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
} from "../controllers/userController.js"; // Importing controller functions

// Creating a router instance
const router = express.Router();

// Routes for handling user-related operations
router.post("/loginUser", loginUser); // Route to log in a user
router.get("/logoutUser", isAuthenticated, logoutUser); // Route to log out a user
router.get("/currentUserProfile", isAuthenticated, currentUserProfile); // Route to get current user's profile
router.post("/registerUser", registerUser); // Route to register a new user
router.get("/getAllUsers", getAllUsers); // Route to get all users
router.patch("/updateUserProfile", isAuthenticated, updateUserProfile); // Route to update user's profile

// Exporting the router
export default router;
