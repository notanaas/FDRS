import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './App.css'; // Import your CSS file here

export const faculties = [
  {
    id: 1,
    name: 'Faculty Of IT',
    Facultys: [
    
    ],
  },
  {
    id: 2,
    name: 'Faculty Of Engineering',
    Facultys: [
      
    ],
  },
  

];

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
    <div className="authButton">
      {faculties.map((faculty) => (
        <div key={faculty.id}>
          <button
            className={`authButton ${selectedFaculty === faculty.id ? 'selected' : ''}`}
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
