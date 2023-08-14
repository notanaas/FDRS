import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 500px; /* Set the desired height for the welcoming page */
  background-color: #f9f9f9; /* Light gray color */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #555;
  max-width: 500px;
  text-align: center;
  margin-bottom: 40px;
`;

const ExploreButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;
const WelcomingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5rem 0;
`;

const WelcomingPage = ({ onExploreClick }) => {
  return (
    <WelcomingContainer>
      <h1>Welcome to Our FDRS</h1>
      <p>.</p>
      <ExploreButton onClick={onExploreClick}>Explore</ExploreButton>
    </WelcomingContainer>
  );
};



export default WelcomingPage;
