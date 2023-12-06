import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const backendURL = 'http://localhost:3002';

  const fetchUserDetails = async (accessToken) => {
    try {
      const userInfoResponse = await axios.get(`${backendURL}/api_user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (userInfoResponse.data.user) {
        setUser(userInfoResponse.data.user);
        setIsLoggedIn(true);
        setIsAdmin(userInfoResponse.data.user.isAdmin);
      } else {
        throw new Error('User data is not available.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
  
    if (token) {
      // If token exists, verify and set user state
      try {
        await fetchUserDetails(token);
        // Assuming fetchUserDetails will set isLoggedIn and other user details
      } catch (error) {
        console.error('Error checking auth status:', error);
        if (refreshToken) {
          await refreshTokenFunc(); // Attempt to refresh token
        } else {
          logout(); // No valid tokens, logout
        }
      }
    } else if (refreshToken) {
      await refreshTokenFunc(); // No access token but refresh token exists
    } else {
      logout(); // No tokens, logout
    }
  };
  
  const refreshTokenFunc = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available.');
  
      const response = await axios.post(`${backendURL}/api_auth/refreshToken`, { refreshToken });
      const { accessToken, newRefreshToken, user } = response.data;
  
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken || refreshToken);
      setAuthToken(accessToken);
      setIsLoggedIn(true);
      setIsAdmin(user.isAdmin);
      setUser(user);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };
  
  

 
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const updateLoginStatus = (status, adminStatus = false, userDetails = null) => {
    setIsLoggedIn(status);
    setIsAdmin(adminStatus);
    setUser(userDetails);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin');
    setAuthToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
    if (token && refreshToken) {
      setAuthToken(token);
      setIsLoggedIn(true);
      setIsAdmin(isAdmin);
      // Fetch user details with the token
      fetchUserDetails(token).catch(() => {
        // If fetching user details fails, try refreshing the token
        refreshTokenFunc().catch(logout); // If refresh also fails, then logout
      });
    } else if (refreshToken) {
      // No access token, but refresh token is available
      refreshTokenFunc().catch(logout); // If refresh fails, then logout
    }
    // If there are no tokens, maintain the logged out state
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
      refreshTokenFunc
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
