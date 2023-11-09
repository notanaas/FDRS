// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem('isAdmin')));

  useEffect(() => {
    // On component mount, we check if we have a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};