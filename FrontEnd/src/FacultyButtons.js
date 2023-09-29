import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { faculties } from './data';
import './App.css'; // Import your CSS file here

const FacultyButtons = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const history = useHistory();

  const handleFacultyClick = (facultyId, facultyName) => {
    setSelectedFaculty((prevSelectedFaculty) =>
      prevSelectedFaculty === facultyId ? null : facultyId
    );
    navigateToFacultyPage(facultyName);
  };

  const navigateToFacultyPage = (facultyName) => {
    history.push(`/Facultys/${facultyName}`);
  };

  return (
    <div className="facultyButtonsContainer">
      {faculties.map((faculty) => (
        <div key={faculty.id}>
          <button
            className={`facultyButton ${selectedFaculty === faculty.id ? 'selected' : ''}`}
            onClick={() => handleFacultyClick(faculty.id, faculty.name)}
          >
            {faculty.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FacultyButtons;
