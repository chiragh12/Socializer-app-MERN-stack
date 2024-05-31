// Importing the Express application instance from app.js
import app from "./app.js";

// Importing Cloudinary for image management
import cloudinary from "cloudinary";

// Configuring Cloudinary with credentials from environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Starting the server and listening on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server running on port no ${process.env.PORT}`);
});
