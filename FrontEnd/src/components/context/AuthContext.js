import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!authToken);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (token) {
      setAuthToken(token);
    }
    setIsAdmin(storedIsAdmin);
  }, []);
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : null;

    // Check if the token is present upon initial load
    setIsLoggedIn(!!authToken);
    // Function to validate the token
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This is a hypothetical API endpoint that validates your token
          await axios.get('/refreshToken', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // If the token is valid, set the logged-in state
          setIsLoggedIn(true);
          setAuthToken(token);
        } catch (error) {
          // If the token is invalid or there's an error, handle accordingly
          setIsLoggedIn(false);
          setAuthToken(null);
          localStorage.removeItem('token');
        }
      }
    };
  
    validateToken();
  }, [setIsLoggedIn, setAuthToken,authToken]); // Dependencies for the useEffect
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, authToken, setAuthToken, isAdmin, setIsAdmin  }}>
      {children}
    </AuthContext.Provider>
  );
};

