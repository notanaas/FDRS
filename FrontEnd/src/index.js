import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios'; // Import axios
import AppContent from './components/App';
import { FacultyProvider } from './components/context/FacultyContext';
import { ThemeProvider } from './components/context/ThemeContext';
import { DarkModeProvider } from './components/context/DarkModeContext';
import './components/App.css';
import 'font-awesome/css/font-awesome.min.css';

// Axios default header configuration
const configureAxios = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

function MainApp() {
  // Configure Axios when the MainApp component is mounted
  React.useEffect(() => {
    configureAxios();
  }, []);

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

// Use the new createRoot API for React 18
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<MainApp />);
