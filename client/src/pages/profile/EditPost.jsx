import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseSharp } from "react-icons/io5"; // Import IoCloseSharp icon

const EditPost = () => {
  const { id } = useParams(); // Get post ID from the URL
  const navigate = useNavigate();
  const { auth } = useAuth();

  // State variables
  const [post, setPost] = useState({});
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // State variable for avatar preview

  // Fetch the post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/post/getSinglePost/${id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setPost(res.data.post);
          setDescription(res.data.post.description);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to fetch post");
      }
    };

    fetchPost();
  }, [id, auth.token]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    // Generate preview URL for the selected image file
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Handle updating post
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/post/updatePost/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Post updated successfully");
        navigate("/myposts"); // Redirect to profile
      } else {
        toast.error(res.data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <ToastContainer />
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Edit Post</h1>
          <button
            onClick={() => navigate("/myposts")}
            className="text-gray-400 hover:text-gray-100"
          >
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>
        <form
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          onSubmit={handleUpdatePost}
        >
          {/* Description input */}
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>
          {/* Avatar upload */}
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="avatar"
            >
              Upload Image
            </label>
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600">
                <IoCloseSharp className="text-white mr-2" />
                <span className="text-white">Choose File</span>
                <input
                  type="file"
                  id="avatar"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="ml-2 w-12 h-12 object-cover rounded-full"
                />
              )}
            </div>
          </div>
          {/* Preview of current avatar */}
          {post.avatar && (
            <div className="mb-4">
              <img
                src={post.avatar.url}
                alt="Post Avatar"
                className="w-full max-h-64 object-contain rounded-lg border border-gray-600"
              />
            </div>
          )}
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
