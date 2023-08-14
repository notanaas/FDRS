import React, { useState } from 'react';
import styled from 'styled-components';
import { faculties } from './data';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 20px; /* Add margin on the left and right */
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

const SubjectButton = styled.button`
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

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;

const FileUploadButton = styled.button`
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

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const FacultyButtons = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleFacultyClick = (facultyId) => {
    setSelectedFaculty((prevSelectedFaculty) =>
      prevSelectedFaculty === facultyId ? null : facultyId
    );
  };

  return (
    <Container>
      {faculties.map((faculty) => (
        <div key={faculty.id}>
          <FacultyButton onClick={() => handleFacultyClick(faculty.id)}>
            {faculty.name}
          </FacultyButton>
          {selectedFaculty === faculty.id && (
            <div>
              {faculty.subjects.map((subject) => (
                <Link key={subject.id} to={`/subject/${subject.name}`}>
                  <SubjectButton>{subject.name}</SubjectButton>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </Container>
  );
};

export default FacultyButtons;
