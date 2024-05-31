// Import necessary modules and functions
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middleware/error.js";
import cloudinary from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

// Function to register a new user
export const registerUser = catchAsyncError(async (req, res, next) => {
  // Check if user avatar is provided
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("User avatar required", 400));
  }

  // Check if the avatar format is allowed
  const { avatar } = req.files;
  const allowedFormats = [
    "image/png",
    "image/jpeg",
    "image/avif",
    "image/webp",
  ];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler("The avatar format must be PNG, JPEG, AVIF, WEBP", 400)
    );
  }

  // Validate user data
  const { name, email, password, gender, dob } = req.body;
  if (!name || !email || !password || !gender || !dob) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already Registered"));
  }

  // Upload avatar to Cloudinary
  let cloudinaryResponse;
  try {
    cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);
  } catch (error) {
    console.error("Cloudinary error:", error);
    return next(new ErrorHandler("Error uploading avatar to Cloudinary", 500));
  }

  // Create new user
  user = await User.create({
    name,
    email,
    password,
    gender,
    dob,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // Send token
  sendToken(user, "User registered successfully", 200, res);
});

// Function to login a user
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Send token
  sendToken(user, "User Logged in successfully!", 200, res);
});

// Function to logout a user
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User Logged Out!",
    });
});

// Function to get current user's profile
export const currentUserProfile = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User Information is given below",
    user,
  });
});

// Function to update user's profile
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const { avatar } = req.files;
  const userId = req.user._id;

  // Validation
  switch (true) {
    case !name:
      return res.status(400).json({ error: "Name is required" });
    case !email:
      return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Fetch the user's data
    const user = await User.findById(userId);

    // Upload photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath
    );

    // Check for Cloudinary errors
    if (!cloudinaryResponse) {
      console.error(
        "Cloudinary error : ",
        cloudinaryResponse.error || "unknown cloudinary error!"
      );
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        avatar: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      },
      { new: true }
    );

    // Send the response
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error while updating user profile",
    });
  }
});

// Function to get all users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    message: "User Information is given below",
    users,
  });
});
