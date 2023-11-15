import React, { useEffect } from 'react';
import axios from 'axios'; // Import axios
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomingPage from './WelcomingPage';
import FacultyPage from './FacultyPage';
import AdminPage from './AdminPage';
import ResourcePage from './ResourcePage';
import PasswordReset from './PasswordReset';
import { AuthProvider } from './context/AuthContext';
import Header from './Header';
import './App.css';

const authToken = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : null;
const configureAxios = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

configureAxios();

function App() {
  useEffect(() => {
    configureAxios();
  }, []);

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
      <AuthProvider> 
        <div className="App">
          <Header />
          
          <div className="contentContainer">
            <Switch>
              <Route path="/welcomingpage" exact component={WelcomingPage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/reset-password" component={PasswordReset} />
              <Route
                path="/faculty/:facultyId"
                render={(props) => (
                  <FacultyPage {...props} facultyId={props.match.params.facultyId} />
                )}
              />
              <Route
                path="/resource/:resourceId"
                render={(props) => (
                  <ResourcePage {...props} resources={resources} />
                )}
              />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
