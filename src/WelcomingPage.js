// WelcomingPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import FacultyButtons from './FacultyButtons';
import FileUpload from './FileUpload';

const Container = styled.div`
  text-align: center;
  padding: 100px;
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const SubText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
`;

const SubjectUploadButton = styled(FileUpload)`
  margin-top: 20px;
`;

const WelcomingPage = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Function to handle subject selection
  const handleSubjectSelection = (subjectName) => {
    setSelectedSubject(subjectName);
  };

  return (
    <Container>
      <WelcomeText>Welcome to our FDRS!</WelcomeText>
      <SubText>Explore our faculties and subjects</SubText>
      <FacultyButtons onSubjectSelect={handleSubjectSelection} />
      {selectedSubject && (
        <div>
          <h2>Upload Files for {selectedSubject}</h2>
          <SubjectUploadButton />
        </div>
      )}
    </Container>
  );
};

export default WelcomingPage;
