// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Header';
import WelcomingPage from './WelcomingPage';
import Footer from './Footer';
import SubjectPage from './SubjectPage';
import { useParams } from 'react-router-dom';

const App = () => {
  const [showFaculties, setShowFaculties] = useState(false);
  const { subjectName } = useParams();

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
      <Header subjectName={subjectName} /> {}
      <Switch>
        <Route path="/" exact component={WelcomingPage} />
        <Route path="/subjects/:subjectName" component={SubjectPage} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
