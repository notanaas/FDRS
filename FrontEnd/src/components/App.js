import React, { useState, useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import WelcomingPage from './WelcomingPage';
import ResourcePage from './ResourcePage';
import FacultyPage from './FacultyPage';
import PasswordReset from './PasswordReset';
import MyProfile from './MyProfile';
import Header from './Header';
import FileUpload from './FileUpload';
import { AuthProvider } from './context/AuthContext';
import { RouteParamsProvider} from './context/RouteParamsContext';
import { ActiveSectionProvider } from './context/ActiveSectionContext';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]); 
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  const backendURL = 'http://localhost:3002';
  useEffect(() => {
    if (searchResults.length > 0) {
      const timer = setTimeout(() => {
        setSearchResults([]);
      }, 4000); 

      return () => clearTimeout(timer); 
    }
  }, [searchResults]); 
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

  const handleSearch = async (searchTerm, facultyId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api_resource/search/${facultyId}`, {
        params: { term: searchTerm }
      });
      setSearchResults(response.data);
      setShowFeedbackButton(response.data.length === 0); 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setShowFeedbackButton(true); // Show button on 404 error
      } else {
        setShowFeedbackButton(false); // Don't show button for other errors
      }
    } finally {
      setLoading(false);
    }
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
          <ActiveSectionProvider>
            <div className="App">
              <Header 
                setIsModalOpen={setIsModalOpen} 
                onSearch={handleSearch} 
                showFeedbackButton={showFeedbackButton}
              />
              {isModalOpen && <FileUpload isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
              <div className="contentContainer">
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/welcomingpage" />
                  </Route>
                  <Route path="/welcomingpage" exact component={WelcomingPage} />
                  <Route path="/reset-password" component={PasswordReset} />
                  <ProtectedRoute path="/my-profile" component={MyProfile} /> {/* Protected route for My Profile */}
                  <Route path="/faculty/:facultyId" render={(props) => <FacultyPage {...props} searchResults={searchResults} />} />
                  <Route path="/resource/:resourceId" component={ResourcePage} />
                </Switch>
              </div>
            </div>
          </ActiveSectionProvider>
        </RouteParamsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
