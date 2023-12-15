import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import WelcomingPage from './WelcomingPage';
import ResourcePage from './ResourcePage';
import FacultyPage from './FacultyPage';
import PasswordReset from './PasswordReset';
import MyProfile from './MyProfile';
import { AuthProvider } from './context/AuthContext';
import FileUpload from './FileUpload';
import Header from './Header';
import { RouteParamsProvider } from './context/RouteParamsContext';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes('/faculty/');
  const backendURL = 'http://localhost:3002';

  useEffect(() => {
    // Configure Axios defaults for every request
    const configureAxios = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };

    // Add Axios response interceptor
    const setupAxiosInterceptors = () => {
      axios.interceptors.response.use(response => {
        return response;
      }, async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            // Call your refresh token endpoint
            const tokenResponse = await axios.post(`${backendURL}/api_auth/refreshToken`, { refreshToken });
            const { accessToken } = tokenResponse.data;
            // Update the local storage and original request with new token
            localStorage.setItem('token', accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axios(originalRequest); // Retry the original request with the new token
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            // Handle token refresh error (e.g., logout user, redirect to login)
          }
        }
        return Promise.reject(error);
      });
    };

    configureAxios();
    setupAxiosInterceptors();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <RouteParamsProvider>

          <div className="App">
            <Header setIsModalOpen={setIsModalOpen} isFacultyPage={isFacultyPage} />

            {isModalOpen && (
              <FileUpload isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            )}
            <div className="contentContainer">
              <Switch>
                <Route path="/welcomingpage" exact component={WelcomingPage} />
                <Route path="/reset-password" component={PasswordReset} />
                <Route path="/my-profile" component={MyProfile} />
                <Route path="/faculty/:facultyId" component={FacultyPage} />
                <Route path="/resource/:resourceId" component={ResourcePage} />
              </Switch>
            </div>
          </div>
        </RouteParamsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
