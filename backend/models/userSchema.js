// Importing required modules
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Defining the schema for users
const userSchema = new mongoose.Schema({
  // Name of the user
  name: {
    type: String,
    required: [true, "Name must be provided"],
    minLength: [3, "Name must contain at least 3 characters"],
    maxLength: [20, "Name must contain less than 20 characters"],
  },
  // Email of the user
  email: {
    type: String,
    required: [true, "Email must be provided"],
    unique: [true, "User already exists"],
    validate: [validator.isEmail, "Provide a valid email"],
  },
  // Password of the user
  password: {
    type: String,
    required: [true, "Password must be provided"],
    minLength: [8, "Password must contain at least 8 characters"],
    maxLength: [32, "Password must contain less than 32 characters"],
    select: false, // Password will not be included in query results by default
  },
  // Gender of the user
  gender: {
    type: String,
    enum: ["Male", "Female"], // Gender must be one of these values
    required: [true, "Gender must be provided"],
  },
  // Date of Birth of the user
  dob: {
    type: Date,
    required: [true, "Date of Birth must be provided"],
    validate: {
      validator: function (value) {
        // Validate that the user is at least 16 years old
        const ageDifMs = Date.now() - value.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 16;
      },
      message: "User must be at least 16 years old",
    },
  },
  // Avatar of the user
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
  // Timestamp of when the user was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, proceed to the next middleware
  }
  try {
    // Hashing the password using bcrypt
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error); // Pass any errors to the next middleware
  }
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Method to generate JWT token for user
userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Creating the User model
export const User = mongoose.model("User", userSchema);
