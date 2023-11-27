import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomingPage from './WelcomingPage';
import ResourcePage from './ResourcePage';
import FacultyPage from './FacultyPage';
import Header from './Header';
import PasswordReset from './PasswordReset';
import MyProfile from './MyProfile'; 
import { AuthProvider } from './context/AuthContext';
import Header from './Header';
import './App.css';

function App() {
  useEffect(() => {
    // Configure Axios when the MainApp component is mounted
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
        <div className="App">
          <Header />
          <div className="contentContainer">
            <Switch>
              <Route path="/welcomingpage" exact component={WelcomingPage} />
              <Route path="/reset-password" component={PasswordReset} />
              <Route path="/my-profile" component={MyProfile} />
              <Route path="/faculty/:facultyId" component={Header} />

              <Route path="/faculty/:facultyId" component={FacultyPage} />
              <Route path="/resource/:resourceId" component={ResourcePage} />

            </Switch>
          </div>
        </div>
      </AuthProvider>
  </Router>
  );
}

export default App;
