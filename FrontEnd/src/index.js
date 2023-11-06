import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppContent from './components/App';
import { FacultyProvider } from './components/context/FacultyContext';
import { ThemeProvider } from './components/context/ThemeContext';
import { DarkModeProvider } from './components/context/DarkModeContext';
import './components/App.css';
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

// Use the new createRoot API for React 18
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<MainApp />);
