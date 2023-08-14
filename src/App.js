import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import FacultyButtons from './FacultyButtons';
import WelcomingPage from './WelcomingPage';
import ScrollToTopButton from './ScrollToTopButton';
import Footer from './Footer';
import SubjectPage from './SubjectPage'; // Import SubjectPage component

const App = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null); // Add selectedSubject state
  const [searchText, setSearchText] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showFaculties, setShowFaculties] = useState(false);

  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty((prevSelectedFaculty) =>
      prevSelectedFaculty === facultyId ? null : facultyId
    );
    setSelectedSubject(null); // Clear selected subject when changing faculties
    setSearchText('');
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleScroll = () => {
    const isScrolledDown = window.scrollY > 200;
    setShowScrollButton(isScrolledDown);
  };

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

  return (
    <Router>
      <Header
        selectedFacultyName={selectedFaculty ? `Faculty ${selectedFaculty}` : 'All Faculties'}
        onSearchChange={handleSearchChange}
      />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/subjects/:subjectName">
          <SubjectPage selectedSubject={selectedSubject} />
        </Route>
      </Switch>
      <WelcomingPage onExploreClick={handleExploreClick} />
      {showScrollButton && <ScrollToTopButton show={showScrollButton} onClick={handleScrollToTop} />}
      {showFaculties && (
        <div id="faculty-section">
          <FacultyButtons
            setSelectedFaculty={handleFacultyChange}
            setSelectedSubject={setSelectedSubject}
            selectedFaculty={selectedFaculty}
          />
        </div>
      )}
      <Footer />
    </Router>
  );
};

export default App;
