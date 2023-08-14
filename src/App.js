import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import FacultyButtons from './FacultyButtons';
import WelcomingPage from './WelcomingPage';
import ScrollToTopButton from './ScrollToTopButton';
import Footer from './Footer';
import SubjectPage from './SubjectPage'; // Import the new SubjectPage component

const App = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showFaculties, setShowFaculties] = useState(false);

  const handleFacultyChange = (facultyId, facultyName) => {
    setSelectedFaculty((prevSelectedFaculty) =>
      prevSelectedFaculty === facultyId ? null : facultyId
    );
    setSearchText('');
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleScroll = () => {
    const isScrolledDown = window.scrollY > 200; 
    setShowScrollButton(isScrolledDown);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreClick = () => {
    setShowFaculties(true);
    const facultySection = document.getElementById('faculty-section');
    if (facultySection) {
      facultySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubjectClick = (subjectName) => {
    setSelectedSubject(subjectName);
  };


  return (
    <Router>
      <Header
        selectedFacultyName={selectedFaculty ? `Faculty ${selectedFaculty}` : 'All Faculties'}
        onSearchChange={handleSearchChange}
      />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/subject/:subjectName" render={(props) => <SubjectPage selectedFaculty={selectedFaculty} {...props} />} />
      </Switch>
      <WelcomingPage onExploreClick={handleExploreClick} />
      {showScrollButton && <ScrollToTopButton show={showScrollButton} onClick={handleScrollToTop} />}
      {showFaculties && (
        <div id="faculty-section">
          <FacultyButtons selectedFaculty={selectedFaculty} setSelectedFaculty={handleFacultyChange} />
        </div>
      )}
            <SubjectPage selectedSubject={selectedSubject} /> {/* Render the SubjectPage */}

      <Footer />
    </Router>
  );
};

export default App;
