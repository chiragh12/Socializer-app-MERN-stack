import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/Homepage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUp";
import { ToastContainer } from "react-toastify";
import SideBar from "./components/common/SideBar";
import { useAuth } from "./context/AuthProvider";
import EditPost from "./pages/profile/EditPost";
import ProfilePage from "./pages/profile/ProfilePage";

const PrivateRoute = ({ element, ...rest }) => {
  const { auth } = useAuth();

  // Render the sidebar and page content if user is authenticated
  // Otherwise, redirect to the login page
  return auth.user ? (
    <>
      <SideBar />
      {element}
    </>
  ) : (
    <Navigate to="/login" replace state={{ from: rest.location }} />
  );
};

function App() {
  const { auth } = useAuth();

  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        {/* Redirect to the home page if user is authenticated, otherwise redirect to the login page */}
        <Route
          path="/"
          element={
            auth.user ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        {/* Private route for the home page */}
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
        {/* Private route for the profile page */}
        <Route
          path="/myposts"
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        {/* Public route for the sign-up page */}
        <Route path="/signup" element={<SignUpPage />} />
        {/* Public route for the login page */}
        <Route path="/login" element={<LoginPage />} />
        {/* Private route for editing a post */}
        <Route
          path="/editPost/:id"
          element={<PrivateRoute element={<EditPost />} />}
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
