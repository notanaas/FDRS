import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token')); 
  const [user, setUser] = useState(null); // State to store logged-in user's data
  const backendURL = 'http://localhost:3002';

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authToken) {
        // If authToken is already set, we assume the user is logged in
        setIsLoggedIn(true);
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        // Fetch user details
        fetchUserDetails();
      } else {
        // If not, we check for a refresh token to attempt a refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // If no refresh token, we ensure the user is logged out
          logout();
          return;
        }

        try {
          const response = await axios.post(`${backendURL}/api_auth/refreshToken`, { refreshToken });
          localStorage.setItem('token', response.data.accessToken);
          setAuthToken(response.data.accessToken); // Update authToken state
          setIsLoggedIn(true);
          setIsAdmin(localStorage.getItem('isAdmin') === 'true');
          fetchUserDetails(); // Fetch user details after refreshing token
        } catch (error) {
          console.error('Error refreshing token:', error);
          logout(); // Logout user if token refresh fails
        }
      }
    };

    checkAuthStatus();
  }, [backendURL]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_user/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUser(response.data.user); // Set user details in context
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUser(null); // Clear user data on error
    }
  };

  const logout = () => {
    // Function to handle user logout
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAuthToken(null);
    setUser(null); // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin');
    // Redirect to login or home page as needed
  };

  const updateLoginStatus = (status, adminStatus = false, userDetails = null) => {
    setIsLoggedIn(status);
    setIsAdmin(adminStatus);
    setUser(userDetails);
    if (!status) {
      // If status is false, it means we are logging out the user
      logout();
    }
  };

  // Include the methods for login, logout, and triggering forgot password in the context value
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      isAdmin,
      setIsAdmin,
      authToken,
      setAuthToken,
      user,
      setUser,
      updateLoginStatus,
      fetchUserDetails,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
