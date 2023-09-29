import FacultyPage from './FacultyPage';
import { FacultyProvider } from './FacultyContext';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomingPage from './WelcomingPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


  return (
    <div >
        <FacultyProvider>
          <div className="App">
            <Router>
              <div className="contentContainer">
                <Switch>
                  <Route path="/" exact component={WelcomingPage} />
                  
                  <Route
                    path="/Facultys/:FacultyName"
                    render={(props) => (
                      <FacultyPage {...props} facultyName={props.match.params.FacultyName} />
                    )}
                  />
                </Switch>
              </div>
            </Router>
          </div>
        </FacultyProvider>
    </div>
  );
};

export default App;
