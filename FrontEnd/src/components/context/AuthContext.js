import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const backendURL = 'http://localhost:3002';
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin');
    setAuthToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };
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
      setUser(user); // This updates the user information in the context

    } catch (error) {
      logout();
    }
  };
  


  const updateLoginStatus = (status, adminStatus = false, userDetails = null) => {
    setIsLoggedIn(status);
    setIsAdmin(adminStatus);
    setUser(userDetails);
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);
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
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
