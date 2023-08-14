import React from 'react';
import styled from 'styled-components';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const ScrollToTopButton = ({ onClick }) => {
  return <ScrollButton onClick={onClick}>Scroll to Top</ScrollButton>;
};

export default ScrollToTopButton;
