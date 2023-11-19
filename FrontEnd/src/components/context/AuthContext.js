import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const backendURL = 'http://localhost:3002';

  
  const triggerForgotPassword = async (email) => {
    try {
      await axios.post(`${backendURL}/api_auth/forgot-password`, { email });
    } catch (error) {
    }
  };
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken || !token) {
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
        setIsLoggedIn(true);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
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
