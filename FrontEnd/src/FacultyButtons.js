import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { faculties } from './data';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 0 20px;
`;

const FacultyButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  background-color: #8b0000;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000;
  }
`;

const SubjectContainer = styled.div`
  display: flex;
  flex-direction: column; /* Change to column layout */
  align-items: flex-start;
`;

const SubjectButton = styled(Link)`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #8b0000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
  text-decoration: none;

  &:hover {
    background-color: #6a0000;
  }
`;

const FacultyButtons = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleFacultyClick = facultyId => {
    setSelectedFaculty(prevSelectedFaculty =>
      prevSelectedFaculty === facultyId ? null : facultyId
    );
  };

  return (
    <Container>
      {faculties.map(faculty => (
        <div key={faculty.id}>
          <FacultyButton onClick={() => handleFacultyClick(faculty.id)}>
            {faculty.name}
          </FacultyButton>
          {selectedFaculty === faculty.id && (
            <SubjectContainer>
              {faculty.subjects.map(subject => (
                <SubjectButton key={subject.id} to={`/subjects/${subject.name}`}>
                  {subject.name}
                </SubjectButton>
              ))}
            </SubjectContainer>
          )}
        </div>
      ))}
    </Container>
  );
};

export default FacultyButtons;
