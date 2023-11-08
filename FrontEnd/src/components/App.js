import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomingPage from './WelcomingPage';
import FacultyPage from './FacultyPage';
import ResourcePage from './ResourcePage';
import PasswordReset from './PasswordReset';
import { AuthProvider } from './context/AuthContext';
import Header from './Header';
function App() {

  const resources = [
    {
      id: 1,
      title: 'Resource 1',
      author: 'Author 1',
      imageUrl: 'resource1.jpg',
      documentUrl: 'resource1.pdf',
    },
    {
      id: 2,
      title: 'Resource 2',
      author: 'Author 2',
      imageUrl: 'resource2.jpg',
      documentUrl: 'resource2.pdf',
    },
  ];
  return (
    <Router> 
      <AuthProvider> 
        <div className="App">
          <Header />
          <main>
            <p>Main content of the page...</p>
          </main>
          <div className="contentContainer">
            <Switch>
              <Route path="/" exact component={WelcomingPage} />
              <Route path="/reset-password" component={PasswordReset} />
              <Route
                path="/faculty/:facultyId" // Use 'facultyId' as the URL parameter
                render={(props) => (
                  // Pass 'facultyId' to the FacultyPage component
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

