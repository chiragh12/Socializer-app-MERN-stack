// Importing Mongoose module
import mongoose from "mongoose";

// Importing User model
import { User } from "./userSchema.js";

// Defining the schema for posts
const postSchema = new mongoose.Schema(
  {
    // Description of the post
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    // Avatar of the post
    avatar: {
      // Public ID of the avatar in cloud storage
      public_id: {
        type: String,
        required: true,
      },
      // URL of the avatar
      url: {
        type: String,
        required: true,
      },
    },
    // Reference to the user who created the post
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Post must have a creator"],
    },
    // Name of the user who created the post
    creatorName: {
      type: String, // Store the name of the user who created the post
      required: true,
    },
    // Avatar URL of the user who created the post
    creatorAvatar: {
      type: String, // Store the avatar URL of the user who created the post
      required: true,
    },
    // Timestamp of when the post was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Array of user IDs who liked the post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Ensure virtual properties are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index to improve query performance on createdBy and createdAt
postSchema.index({ createdBy: 1, createdAt: -1 });

// Middleware to populate creatorName and creatorAvatar before saving the post

// Creating the Post model
export const Post = mongoose.model("Post", postSchema);
