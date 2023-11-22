import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token')); 
  const backendURL = 'http://localhost:3002';

  const triggerForgotPassword = async (email) => {
    try {
      await axios.post(`${backendURL}/api_auth/forgot-password`, { email });
    } catch (error) {
      // Consider logging the error or setting an error state
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

      if (!token || !refreshToken) {
        setIsLoggedIn(false);
        setIsAdmin(false);
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
      } catch (error) {
        console.error('Error refreshing token:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAdmin');
      }
    };

    checkAuthStatus();
  }, []);
  const updateLoginStatus = (status) => {
    setIsLoggedIn(status);
    // Perform other login status update operations if necessary
  };
  return (
    <AuthContext.Provider value={{ updateLoginStatus,authToken, setAuthToken, isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, triggerForgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
