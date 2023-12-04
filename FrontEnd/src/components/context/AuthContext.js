import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // State to store logged-in user's data
  const backendURL = 'http://localhost:3002';
  const fetchUserDetails = async (accessToken) => {
    try {
      const userInfoResponse = await axios.get(`${backendURL}/api_user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (userInfoResponse.data.user) {
        setUser(userInfoResponse.data.user); // Set user data
        setIsLoggedIn(true);
        setIsAdmin(userInfoResponse.data.user.isAdmin); // Adjust based on your user object structure
      } else {
        throw new Error('User data is not available.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout(); // Logout on error
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

        localStorage.setItem('token', response.data.accessToken);
        setAuthToken(response.data.accessToken);
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
  }, []);

  const updateLoginStatus = (status, adminStatus = false, userDetails = null) => {
    setIsLoggedIn(status);
    setIsAdmin(adminStatus);
    setUser(userDetails); // Set user details when logging in
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin');
    setAuthToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null); // Clear user data on logout
  };

  // Provide context values and functions to the children
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
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
