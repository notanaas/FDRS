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
      if (!refreshToken || refreshToken.length < 1 || !token || token.length < 1) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }
      try {
        const response = await axios.post(`${backendURL}/api_auth/refreshToken`, { 
          headers: {
            Authorization: 'Bearer: ' + token
          },
          refreshToken
        });
        localStorage.setItem('token', response.data.accessToken);
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
