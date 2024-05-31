import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = () => {
  // State variables to manage posts, loading state, and error state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Effect hook to fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts from the server
        const response = await axios.get(
          "http://localhost:4000/api/v1/post/getAllPosts"
        );

        // Sort posts in descending order based on createdAt timestamp
        const sortedPosts = response.data.posts.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Update state with sorted posts and set loading to false
        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        // Handle error if fetching fails
        setError(error.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchPosts(); // Invoke fetchPosts function
  }, []); // Empty dependency array to run only once when the component mounts

  // Function to handle post deletion
  const handlePostDelete = (postId) => {
    // Filter out the deleted post from the state
    setPosts(posts.filter((post) => post._id !== postId));
  };

  // Render PostSkeleton while data is being fetched
  if (loading) {
    return <PostSkeleton />;
  }

  // Render error message if an error occurs during fetching
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Render message if there are no posts */}
      {posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {/* Map over posts array and render Post component for each post */}
      {posts.map((post) => (
        <Post key={post._id} post={post} handlePostDelete={handlePostDelete} />
      ))}
    </>
  );
};

export default Posts;
