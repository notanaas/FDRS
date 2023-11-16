import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const backendURL = 'http://localhost:3002';

  // Method to update login status
  
  const triggerForgotPassword = async (email) => {
    try {
      await axios.post(`${backendURL}/api_auth/forgot-password`, { email });
      // handle success - maybe set a state or show a notification
    } catch (error) {
      // handle error
    }
  };
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${backendURL}/api_refreshToken`, { withCredentials: true });
        setIsLoggedIn(true);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin,triggerForgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
