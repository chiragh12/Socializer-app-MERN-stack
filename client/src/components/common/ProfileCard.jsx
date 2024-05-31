import React from "react";
import { useAuth } from "../../context/AuthProvider";

const ProfileCard = () => {
  // Access the authenticated user from the AuthProvider context
  const { auth } = useAuth();
  const { user } = auth; // Destructure user from the auth object

  return (
    // Render user profile card with avatar and name
    <div className="flex flex-col items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg m-4">
      {/* Display user avatar, use default avatar if not provided */}
      <img
        className="w-32 h-32 rounded-full mb-4"
        src={user.avatar?.url || "default-avatar.png"}
        alt={`${user.name}'s avatar`}
      />
      {/* Display user's name */}
      <h2 className="text-xl font-bold text-white mb-2">{user.name}</h2>
    </div>
  );
};

export default ProfileCard;
