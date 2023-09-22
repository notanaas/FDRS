import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #8b0000; /* Dark red color */
  color: #fff;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 0.9rem;
`;

const FooterText = styled.p`
  margin: 0;
`;

const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;
  margin-left: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #6a0000; /* Slightly darker shade of red when hovered */
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>
        © {new Date().getFullYear()} FDRS. All rights reserved. Developed by{' FDRS '}
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
