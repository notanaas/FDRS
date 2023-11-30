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
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

      if (!token || !refreshToken) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null); // Clear user data
        return;
      }

      try {
        const response = await axios.post(`${backendURL}/api_auth/refreshToken`, { refreshToken }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        localStorage.setItem('token', response.data.accessToken);
        setAuthToken(response.data.accessToken); // Update authToken state
        setIsLoggedIn(true);
        setIsAdmin(storedIsAdmin); // Set isAdmin from localStorage

        // Fetch and set user details
        const userInfoResponse = await axios.get(`${backendURL}/api_user/profile`, {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`
          }
        });
        setUser(userInfoResponse.data.user); // Assuming the endpoint returns user data

      } catch (error) {
        console.error('Error refreshing token:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAdmin');
        setUser(null); // Clear user data
      }
    };

    checkAuthStatus();
  }, [backendURL]);

  const triggerForgotPassword = async (email) => {
    try {
      await axios.post(`${backendURL}/api_auth/forgot-password`, { email });
    } catch (error) {
      console.error('Error in forgot password request:', error);
    }
  };

  const updateLoginStatus = (status, adminStatus = false, userDetails = null) => {
    setIsLoggedIn(status);
    setIsAdmin(adminStatus);
    setUser(userDetails); 
  };

  return (
    <AuthContext.Provider value={{
      updateLoginStatus,
      authToken,
      setAuthToken,
      isLoggedIn,
      setIsLoggedIn,
      isAdmin,
      setIsAdmin,
      triggerForgotPassword,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
