import { Link } from "react-router-dom";
import { useState } from "react";
import { BiMaleFemale } from "react-icons/bi";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import SocializerSvg from "../../../components/svg/S";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthProvider";

const SignUpPage = () => {
  // Authentication context
  const { updateAuth } = useAuth();

  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("avatar", avatar);

    try {
      // Send registration request
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/registerUser",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update authentication context
      updateAuth({
        user: data.user,
        token: data.token,
      });

      // Show success message
      toast.success(data.message);

      // Reset form fields
      setName("");
      setEmail("");
      setDob("");
      setPassword("");
      setGender("");
      setAvatar(null);
    } catch (error) {
      // Show error message
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // Placeholder for error state
  const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <div className="flex flex-col items-center">
          <SocializerSvg className="lg:w-2/3 fill-white mb-4" />
          <p className="text-4xl font-extrabold text-white">Socializer</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto  flex flex-col gap-2"
          onSubmit={handleRegister}
        >
          <SocializerSvg className="w-20 lg:hidden fill-white mb-4" />
          <h1 className="text-2xl font-extrabold text-white mb-2">
            Join today.
          </h1>
          <div className="flex flex-wrap gap-2">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
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
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={(e) => setName(e.target.value)}
                value={name}
                pattern="[A-Za-z\s]*" // Allow only alphabets and whitespaces
                title="Please enter only alphabets" // Error message to display when the pattern doesn't match
                required // Make the field required
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdPassword />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <CiCalendarDate />
              <input
                type="date"
                className="grow"
                placeholder="Date of Birth"
                name="dob"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <BiMaleFemale />
              <select
                className="grow"
                name="gender"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUserCircle />
              <input
                type="file"
                name="avatar"
                onChange={handleFileChange}
                className="grow"
              />
            </label>
          </div>
          <button className="btn rounded-full btn-primary text-white">
            Sign up
          </button>
          {/* Display error message if isError is true */}
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
