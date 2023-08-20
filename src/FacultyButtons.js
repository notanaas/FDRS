import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { faculties } from './data';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 20px;
`;

const FacultyButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;

const SubjectButton = styled(Link)`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
  text-decoration: none; /* Add this line to remove default link underline */

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;

const FacultyButtons = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleFacultyClick = (facultyId) => {
    setSelectedFaculty((prevSelectedFaculty) =>
      prevSelectedFaculty === facultyId ? null : facultyId
    );
    setSelectedSubject(null);
  };

  const handleSubjectClick = (subjectName) => {
    setSelectedSubject(subjectName);
  };

  return (
    <Container>
      {faculties.map((faculty) => (
        <div key={faculty.id}>
          <FacultyButton onClick={() => handleFacultyClick(faculty.id)}>
            {faculty.name}
          </FacultyButton>
          {selectedFaculty !== null && faculty.id === selectedFaculty && (
            <div>
              {faculty.subjects.map((subject) => (
                <SubjectButton
                  key={subject.id}
                  to={`/subjects/${subject.name}`}
                  onClick={() => handleSubjectClick(subject.name)}
                >
                  {subject.name}
                </SubjectButton>
              ))}
            </div>
          )}
        </div>
      ))}
    </Container>
  );
};

export default FacultyButtons;