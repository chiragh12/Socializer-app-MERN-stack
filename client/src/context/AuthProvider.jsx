import React, { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

// Create a context for authentication state
const AuthContext = createContext();

// Create a provider component to wrap your application and provide authentication state
const AuthProvider = ({ children }) => {
  // Initialize auth state, check local storage for stored authentication data
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : { user: null, token: "" };
  });

  // Update Axios Authorization header whenever token changes
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = auth.token;
    localStorage.setItem("auth", JSON.stringify(auth)); // Store auth data in local storage
  }, [auth.token]); // Update effect when token changes

  // Function to update auth state
  const updateAuth = (newAuth) => {
    setAuth(newAuth); // Update auth state with new data
  };

  // Provide the auth state and update function to the entire application
  return (
    <AuthContext.Provider value={{ auth, updateAuth }}>
      {children} {/* Render the children components */}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the authentication context
const useAuth = () => useContext(AuthContext);

// Export the custom hook and the provider component
export { useAuth, AuthProvider };
