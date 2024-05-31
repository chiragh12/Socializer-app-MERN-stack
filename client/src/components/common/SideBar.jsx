import { useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import SocializerSvg from "../svg/S.jsx";
import { MdHomeFilled } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth, updateAuth } = useAuth();

  // Function to handle logout
  const handleLogout = () => {
    updateAuth({ user: null, token: "" }); // Clear user authentication
    localStorage.removeItem("auth"); // Remove auth data from local storage
    toast.success("Logged out successfully"); // Show logout success message
    navigate("/login"); // Redirect to login page
  };

  // Function to handle profile click
  const handleProfileClick = () => {
    navigate(`/myposts`); // Navigate to MyPosts.jsx with user's ID
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        {/* Socializer logo and name */}
        <Link to="/" className="flex justify-center md:justify-start">
          <div className="flex items-center">
            <SocializerSvg className="px-2 w-14 h-14 rounded-full fill-white hover:bg-stone-900" />
            <p className="text-white font-bold text-s md:text-base ml-1 hidden md:block">
              Socializer
            </p>
          </div>
        </Link>
        {/* Navigation links */}
        <ul className="flex flex-col gap-3 mt-4">
          {/* Home link */}
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
              <span className="text-sm md:hidden">Home</span>
            </Link>
          </li>
          {/* Profile link */}
          <li className="flex justify-center md:justify-start">
            <div
              onClick={handleProfileClick}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
              <span className="text-sm md:hidden">Profile</span>
            </div>
          </li>
        </ul>
        {/* Logout section */}
        {auth.user && (
          <Link
            onClick={handleLogout}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={auth.user.avatar.url || "/avatar-placeholder.png"}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  Logout
                </p>
                <p className="text-slate-500 text-sm">@{auth.user.name}</p>
              </div>
              <BiLogOut className="w-5 h-5 cursor-pointer" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
