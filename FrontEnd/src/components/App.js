import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Redirect,useLocation} from 'react-router-dom';
import WelcomingPage from './WelcomingPage';
import ResourcePage from './ResourcePage';
import FacultyPage from './FacultyPage';
import PasswordReset from './PasswordReset';
import MyProfile from './MyProfile';
import { AuthProvider } from './context/AuthContext';
import FileUpload from './FileUpload';
import Header from './Header';
import Footer from './Footer';
import AboutUs from './AboutUs';
import { RouteParamsProvider } from './context/RouteParamsContext';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const isFacultyPage = location.pathname.includes('/faculty/');
  const backendURL = 'http://localhost:3002';
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term

  useEffect(() => {
    const configureAxios = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };

    const setupAxiosInterceptors = () => {
      axios.interceptors.response.use(response => {
        return response;
      }, async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const tokenResponse = await axios.post(`${backendURL}/api_auth/refreshToken`, { refreshToken });
            const { accessToken } = tokenResponse.data;
            localStorage.setItem('token', accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
          }
        }
        return Promise.reject(error);
      });
    };

    configureAxios();
    setupAxiosInterceptors();
  }, []);
  const handleSearch = (searchResults) => {
    setSearchTerm(searchResults);
  };
  const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('token') ? true : false;
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to="/welcomingpage" />
          )
        }
      />
    );
  };
  return (
    <Router>
      <AuthProvider>
        <RouteParamsProvider>
          <div className="App">
          <Header setIsModalOpen={setIsModalOpen} onSearch={handleSearch} />
            {isModalOpen && (
              <FileUpload isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            )}
            <div className="contentContainer">
              <Switch>
                <Route exact path="/">
                  <Redirect to="/welcomingpage" />
                </Route>
                <Route path="/welcomingpage" exact component={WelcomingPage} />
                <Route path="/about-us" exact component={AboutUs} />
                <Route path="/reset-password" component={PasswordReset} />
                <ProtectedRoute path="/my-profile" component={MyProfile} />
                <Route path="/faculty/:facultyId" render={(props) => <FacultyPage {...props} searchTerm={searchTerm} />} />
                <Route path="/resource/:resourceId" component={ResourcePage} />
              </Switch>
            </div>
            <Footer/>
          </div>
        </RouteParamsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
