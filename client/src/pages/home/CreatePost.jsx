import { useState, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";

const CreatePost = () => {
  const { auth } = useAuth();

  // State variables
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  // Reference for input file
  const imgRef = useRef();

  // Function to handle avatar selection
  const avatarHandler = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setIsError(false);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("avatar", avatar);

    try {
      // Send post creation request
      const response = await axios.post(
        "http://localhost:4000/api/v1/post/createpost",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Clear form fields
      setDescription("");
      setAvatar(null);
      // Show success message
      toast.success(response.data.message);
      // Reload the page to display the new post
      window.location.reload();
    } catch (error) {
      // Handle errors
      setIsError(true);
      toast.error(error.response.data.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={auth.user.avatar.url || "/avatar-placeholder.png"}
            alt="Avatar"
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* Textarea for post description */}
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What's in your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Display avatar preview if avatar is selected */}
        {avatar && (
          <div className="relative w-72 mx-auto">
            {/* Button to remove avatar */}
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => setAvatar(null)}
            />
            {/* Display selected avatar */}
            <img
              src={URL.createObjectURL(avatar)}
              className="w-full mx-auto h-72 object-contain rounded"
              alt="Preview"
            />
          </div>
        )}

        {/* Input file and post button */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          {/* Input file for selecting avatar */}
          <div className="flex gap-1 items-center">
            <label htmlFor="fileInput">
              <input
                type="file"
                id="fileInput"
                hidden
                ref={imgRef}
                onChange={avatarHandler}
              />
              {/* Icon for selecting avatar */}
              <CiImageOn className="fill-primary w-6 h-6 cursor-pointer" />
            </label>
          </div>
          {/* Button for posting */}
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            disabled={isPending}
          >
            {/* Show posting status */}
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {/* Show error message if isError is true */}
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
