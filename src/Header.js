import React from 'react';
import styled from 'styled-components';


const Logo = styled.img`
  height: 40px; 
  margin-right: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
`;
const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #8b0000; 
  color: #fff;
  padding: 1rem;
  margin-bottom: 20px; 
  text-align: center;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media screen and (min-width: 768px) {
    margin-bottom: 0;
  }
`;



const SearchBar = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #6a0000; 
  color: #fff;
  margin-top: 10px;

  @media screen and (min-width: 768px) {
    margin-top: 0;
    margin-left: 20px;
    ::placeholder {
      color: #fff;
    }
  }
`;


const AuthButtons = styled.div`
  display: flex;
  align-items: center;
`;

const AuthInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #6a0000; 
  color: #fff;
  margin-left: 0.5rem;
  ::placeholder {
    color: #fff;
  }
`;

const AuthButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #8b0000; 
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a0000; 
  }
`;


const Header = ({ selectedFacultyName, onSearchChange }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src="/logo.png" alt="Logo" />
        <SearchBar
          type="text"
          placeholder={`Search in ${selectedFacultyName}`}
          onChange={onSearchChange}
        />
      </LogoContainer>
      <AuthButtons>
        <AuthInput type="text" placeholder="Email" />
        <AuthInput type="password" placeholder="Password" />
        <AuthButton>Login</AuthButton>
        <AuthButton>Sign Up</AuthButton>
      </AuthButtons>
    </HeaderContainer>
  );
};

export default Header;
