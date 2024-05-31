import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    // Function to fetch posts
    const fetchPosts = async () => {
      try {
        // Fetch posts from the server
        const response = await axios.get(
          "http://localhost:4000/api/v1/post/getAllPosts"
        );

        // Filter user's posts
        const userPosts = response.data.posts.filter(
          (post) => post.createdBy === auth.user._id
        );

        // Set the posts state
        setPosts(userPosts);
        setLoading(false);
      } catch (error) {
        // Handle errors
        toast.error(error.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    // Call the fetchPosts function
    fetchPosts();
  }, [auth.user._id]);

  // Function to handle post deletion
  const handlePostDelete = (postId) => {
    // Remove the deleted post from state
    setPosts(posts.filter((post) => post._id !== postId));
  };

  // Render loading skeleton while data is fetching
  if (loading) {
    return <PostSkeleton />;
  }

  // Render error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render message if there are no posts
  if (posts.length === 0) {
    return <p className="text-center my-4">No posts in this tab. Switch 👻</p>;
  }

  // Render each post
  return (
    <>
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          isMyPost={true}
          handlePostDelete={handlePostDelete}
        />
      ))}
    </>
  );
};

export default MyPosts;
