import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomingPage from './WelcomingPage';
import FacultyPage from './FacultyPage';
import AdminPage from './AdminPage';
import ResourcePage from './ResourcePage';
import PasswordReset from './PasswordReset';
import MyProfile from './MyProfile'; 
import { AuthProvider } from './context/AuthContext';
import Header from './Header';
import { FacultyProvider } from './context/FacultyContext';
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

  // Define your resources here
  const resources = [
    {
      id: 1,
      title: 'Resource 1',
      author: 'Author 1',
      imageUrl: 'resource1.jpg',
      documentUrl: 'resource1.pdf',
    },
  ];

  return (
    <Router>
    <FacultyProvider> {/* Move FacultyProvider outside AuthProvider */}
      <AuthProvider>
        <div className="App">
          <Header />
          <div className="contentContainer">
            <Switch>
              <Route path="/welcomingpage" exact component={WelcomingPage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/reset-password" component={PasswordReset} />
              <Route path="/my-profile" component={MyProfile} />
              <Route path="/faculty/:facultyId" render={(props) => <FacultyPage {...props} />} />
              <Route path="/resource/:resourceId" render={(props) => <ResourcePage {...props} resources={resources} />} />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </FacultyProvider>
  </Router>
  );
}

export default App;
