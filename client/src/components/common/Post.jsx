import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaHeart, FaRegHeart, FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";

const Post = ({ post, isMyPost, handlePostDelete }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes.includes(auth.user._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [formattedDate, setFormattedDate] = useState(""); // State to hold formatted date string

  useEffect(() => {
    // Function to calculate time elapsed since post creation
    const calculateTimeElapsed = () => {
      const currentDate = new Date();
      const postDate = new Date(post.createdAt);
      const timeDifference = currentDate - postDate;
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setFormattedDate(`${days}d`);
      } else if (hours > 0) {
        setFormattedDate(`${hours}h`);
      } else if (minutes > 0) {
        setFormattedDate(`${minutes}m`);
      } else {
        setFormattedDate(`${seconds}s`);
      }
    };

    calculateTimeElapsed(); // Calculate time elapsed when component mounts

    // Update time elapsed every minute
    const interval = setInterval(calculateTimeElapsed, 60000);

    return () => clearInterval(interval); // Clean up interval
  }, [post.createdAt]);

  const handleDeletePost = async () => {
    // Confirm the deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/post/deletePost/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Post deleted successfully");
        // Update posts in UI
        handlePostDelete(post._id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditPost = () => {
    navigate(`/editPost/${post._id}`);
  };

  const handleLikePost = async () => {
    try {
      const res = isLiked
        ? await axios.delete(
            `http://localhost:4000/api/v1/post/unlike/${post._id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          )
        : await axios.put(
            `http://localhost:4000/api/v1/post/like/${post._id}`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

      if (res.data.success) {
        setIsLiked(!isLiked);
        setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      toast.error("Failed to like/unlike post");
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <p className="w-8 rounded-full overflow-hidden">
          <img
            src={post.creatorAvatar || "/avatar-placeholder.png"}
            alt="Avatar"
          />
        </p>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <p className="font-bold">{post.creatorName}</p>
          <span className="text-gray-700 flex gap-1 text-sm">
            <span>{formattedDate}</span> {/* Display formatted date */}
          </span>
          {isMyPost && (
            <div className="flex justify-end flex-1 gap-2">
              <FaRegEdit
                className="cursor-pointer hover:text-blue-500"
                onClick={handleEditPost}
              />
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={handleDeletePost}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 py-2 overflow-hidden">
          <span>{post.description}</span>
          {post.avatar && (
            <div className="flex justify-center py-2">
              <img
                src={post.avatar.url}
                className="max-w-full max-h-[500px] object-contain rounded-lg border border-gray-700"
                alt="Post"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 py-3">
          {isLiked ? (
            <FaHeart
              className="cursor-pointer text-red-500"
              onClick={handleLikePost}
            />
          ) : (
            <FaRegHeart className="cursor-pointer" onClick={handleLikePost} />
          )}
          <span>{likesCount} Likes</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
