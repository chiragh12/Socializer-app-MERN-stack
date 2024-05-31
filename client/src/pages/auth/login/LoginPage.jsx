import {
  MdOutlineMail,
  MdPassword,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md"; // Import MdVisibility and MdVisibilityOff icons
import React, { useState } from "react";
import { useAuth } from "../../../context/AuthProvider.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import SocializerSvg from "../../../components/svg/S.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { updateAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/loginUser",
        { email, password },
        {
          withCredentials: true,
        }
      );

      // Update authentication state with user data and token
      updateAuth({
        user: data.user,
        token: data.token,
      });
      toast.success(data.message || "User logged in successfully"); // Show success message

      // Reset form fields
      setEmail("");
      setPassword("");
      navigate("/"); // Redirect to home page
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed"); // Show error message
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left section with logo */}
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <div className="flex flex-col items-center">
          <SocializerSvg className="lg:w-2/3 fill-white" />
          <p className="text-4xl font-extrabold text-white mt-4">Socializer</p>
        </div>
      </div>

      {/* Right section with login form */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <SocializerSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>

          {/* Email input */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>

          {/* Password input */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password type
              className="grow"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {/* Eye button to toggle password visibility */}
            {showPassword ? (
              <MdVisibilityOff onClick={() => setShowPassword(false)} />
            ) : (
              <MdVisibility onClick={() => setShowPassword(true)} />
            )}
          </label>

          {/* Login button */}
          <button className="btn rounded-full btn-primary text-white">
            Login
          </button>
        </form>

        {/* Sign up link */}
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
