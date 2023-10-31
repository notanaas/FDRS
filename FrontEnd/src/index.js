import React, {  } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppContent from './components/App';
import { FacultyProvider } from './components/context/FacultyContext';
import { ThemeProvider } from './components/context/ThemeContext'; // Import ThemeProvider
import './components/App.css';
import ReactDOM from 'react-dom';
import { DarkModeProvider } from './components/context/DarkModeContext'; // Import the context
import 'font-awesome/css/font-awesome.min.css';

function MainApp() {
  return (
    <React.StrictMode>
      <Router>
        <Helmet>
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        </Helmet>
        <DarkModeProvider> 
          <ThemeProvider>
            <FacultyProvider>
              <AppContent />
            </FacultyProvider>
          </ThemeProvider>
        </DarkModeProvider> 
      </Router>
    </React.StrictMode>
  );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
