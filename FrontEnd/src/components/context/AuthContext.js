import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, authToken, setAuthToken, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
