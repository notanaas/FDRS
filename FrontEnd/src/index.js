import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import App from './App';
import './App.css';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Helmet>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>
      </Helmet>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
