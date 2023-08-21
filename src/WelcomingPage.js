import React from 'react';
import styled from 'styled-components';
import FacultyButtons from './FacultyButtons';

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

const WelcomingPage = () => {
  return (
    <Container>
      <WelcomeText>Welcome to our FDRS!</WelcomeText>
      <SubText>Explore our faculties and subjects </SubText>
      <FacultyButtons/>
    </Container>
  );
};

export default WelcomingPage;
