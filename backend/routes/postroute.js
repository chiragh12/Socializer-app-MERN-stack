// Importing required modules
import express from "express";
import { isAuthenticated } from "../middleware/auth.js"; // Importing isAuthenticated middleware
import {
  getSinglePost,
  createPost,
  deletePost,
  updatePost,
  getAllPosts,
  likePost,
  unlikePost,
  getAllUserPosts,
} from "../controllers/postController.js"; // Importing controller functions

// Creating a router instance
const router = express.Router();

// Routes for handling post-related operations
router.post("/createPost", isAuthenticated, createPost); // Route to create a new post
router.delete("/deletePost/:id", isAuthenticated, deletePost); // Route to delete a post by ID
router.put("/updatePost/:id", isAuthenticated, updatePost); // Route to update a post by ID
router.get("/getAllPosts", getAllPosts); // Route to get all posts
router.get("/getSinglePost/:id", isAuthenticated, getSinglePost); // Route to get a single post by ID
router.put("/like/:id", isAuthenticated, likePost); // Route to like a post by ID
router.delete("/unlike/:id", isAuthenticated, unlikePost); // Route to unlike a post by ID
router.get("/getAllUserPosts", isAuthenticated, getAllUserPosts); // Route to get all posts of a user

// Exporting the router
export default router;
