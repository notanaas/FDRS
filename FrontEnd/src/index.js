import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppContent from './App'; // Renamed to avoid naming conflicts
import { SubjectProvider } from './SubjectContext'; // Import SubjectProvider
import './App.css';
import ReactDOM from 'react-dom';


function MainApp() {
  return (
    <React.StrictMode>
      <Router>
        <Helmet>
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        </Helmet>
        <SubjectProvider>
          <AppContent />
        </SubjectProvider>
      </Router>
    </React.StrictMode>
  );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
