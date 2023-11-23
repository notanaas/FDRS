// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App'; // Ensure this import path is correct
import './components/App.css'; // Ensure this path is correct

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
          <App />
  </Router>
);
