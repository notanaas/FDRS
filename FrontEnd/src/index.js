// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App'; // Ensure this import path is correct
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/ThemeContext';
import { DarkModeProvider } from './components/context/DarkModeContext';
import './components/App.css'; // Ensure this path is correct

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <DarkModeProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </DarkModeProvider>
  </Router>
);
