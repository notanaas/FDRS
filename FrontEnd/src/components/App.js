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
  const location = useLocation();  // Add this to use location hook
  const isFacultyPage = location.pathname.includes('/faculty/'); // Determine if current page is a faculty page

  useEffect(() => {
    const configureAxios = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };
    configureAxios();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <RouteParamsProvider>
          <div className="App">
            <Header setIsModalOpen={setIsModalOpen} isFacultyPage={isFacultyPage} /> {/* Pass isFacultyPage as a prop */}
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
