// Importing required modules
import { catchAsyncError } from "../middleware/catchAsyncError.js"; // Importing catchAsyncError middleware
import { Post } from "../models/postSchema.js"; // Importing the Post model
import { User } from "../models/userSchema.js"; // Importing the User model
import ErrorHandler from "../middleware/error.js"; // Importing ErrorHandler
import cloudinary from "cloudinary"; // Importing Cloudinary for image management

// Controller function to create a new post
export const createPost = catchAsyncError(async (req, res, next) => {
  const { description } = req.body;
  
  // Checking if either files or description is provided
  if ((!req.files || Object.keys(req.files).length === 0) && !description) {
    return next(
      new ErrorHandler("Post must have some photo or description", 400)
    );
  }
  
  const { avatar } = req.files || {};
  let cloudinaryResponse;

  if (avatar) {
    // Allowed image formats
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/avif",
      "image/webp",
    ];

    // Validating image format
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(
        new ErrorHandler(
          "The picture format must be PNG, JPEG, AVIF, WEBP",
          400
        )
      );
    }

    try {
      // Uploading image to Cloudinary
      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
      );
    } catch (error) {
      console.error("Cloudinary error:", error);
      return next(
        new ErrorHandler("Error uploading picture to Cloudinary", 500)
      );
    }
  }
  
  // Fetching user by ID
  const createdBy = req.user.id;
  let user = await User.findById(createdBy);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  // Creating new post
  let post = await Post.create({
    avatar,
    description,
    createdBy,
    creatorName: user.name, // Populate creatorName field with user's name
    creatorAvatar: user.avatar.url, // Populate creatorAvatar field with user's avatar URL
    avatar: cloudinaryResponse
      ? {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        }
      : null,
  });

  res.status(201).json({
    success: true,
    post,
  });
});

// Controller function to update a post
export const updatePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let post = await Post.findById(id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 400));
  }

  const { avatar } = req.files || {};
  let cloudinaryResponse;

  if (avatar) {
    // Allowed image formats
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/avif",
      "image/webp",
    ];

    // Validating image format
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(
        new ErrorHandler(
          "The picture format must be PNG, JPEG, AVIF, WEBP",
          400
        )
      );
    }

    try {
      // Deleting the old avatar from Cloudinary if it exists
      if (post.avatar && post.avatar.public_id) {
        await cloudinary.uploader.destroy(post.avatar.public_id);
      }

      // Uploading new image to Cloudinary
      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
      );
    } catch (error) {
      console.error("Cloudinary error:", error);
      return next(
        new ErrorHandler("Error uploading picture to Cloudinary", 500)
      );
    }
  }

  // Updating post data
  const updateData = {
    ...req.body,
    avatar: cloudinaryResponse
      ? {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        }
      : post.avatar,
  };

  post = await Post.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Post updated",
    post,
  });
});

// Controller function to delete a post
export const deletePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  if (post.avatar && post.avatar.public_id) {
    try {
      // Deleting image from Cloudinary
      await cloudinary.uploader.destroy(post.avatar.public_id);
    } catch (error) {
      console.error("Cloudinary error:", error);
      return next(
        new ErrorHandler("Error deleting picture from Cloudinary", 500)
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

// Controller function to get all posts
export const getAllPosts = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

// Controller function to get a single post by ID
export const getSinglePost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("Post does not exist", 404));
  }
  res.status(200).json({
    success: true,
    message: "Post found",
    post,
  });
});

// Controller function to like a post
export const likePost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  // Check if the post has already been liked by the user
  if (post.likes.includes(req.user._id)) {
    return next(new ErrorHandler("Post already liked", 400));
  }

  // Add the user's ID to the likes array
  post.likes.push(req.user._id);
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post liked successfully",
    data: post.likes,
  });
});

// Controller function to unlike a post
export const unlikePost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  // Check if the post has been liked by the user
  if (!post.likes.includes(req.user._id)) {
    return next(new ErrorHandler("Post not liked", 400));
  }

  // Remove the user's ID from the likes array
  // Remove the user's ID from the likes array
  post.likes = post.likes.filter(
    (like) => like.toString() !== req.user._id.toString()
  );
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post unliked successfully",
    data: post.likes,
  });
});

// Controller function to get all posts of a user
export const getAllUserPosts = catchAsyncError(async (req, res, next) => {
  try {
    // Fetch all posts of the logged-in user from the database
    const posts = await Post.find({ createdBy: req.user.id });
    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched",
      posts,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Error fetching post"));
  }
});
