import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Header';
import WelcomingPage from './WelcomingPage';
import Footer from './Footer';

const App = () => {
  const [showFaculties, setShowFaculties] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const facultiesSection = document.getElementById('faculty-section');
    if (facultiesSection) {
      const facultiesSectionTop = facultiesSection.offsetTop;
      setShowFaculties(scrollPosition >= facultiesSectionTop);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={WelcomingPage} />
      </Switch>
      {showFaculties && (
        <div id="faculty-section">
        </div>
      )}
      <Footer />
    </Router>
  );
};

export default App;
