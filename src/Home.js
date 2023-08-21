import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const HomeButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
`;

const InputField = styled.input`
  padding: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;
const Faculties = styled.h3`
  margin: 0;
  font-weight: bold;
`;

const Home = () => {
  return (
    <HomeContainer>
      <TopSection>
        
      </TopSection>
    </HomeContainer>
  );
};

export default Home;
