import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSubject } from './SubjectContext';

const Logo = styled.img`
  height: 40px;
  margin-right: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #8b0000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 20px;
  text-align: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SearchBar = styled.input`
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #6a0000;
  color: #fff;
  ::placeholder {
    color: #fff;
  }
`;

const SearchButton = styled.button`
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

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const SubjectName = styled.h2`
  margin: 0; /* Remove margin to avoid spacing */
  padding: 0;
`;


const Header = ({ selectedFacultyName, onSearchChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { subjectName } = useSubject(); 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle form submission here, e.g., send data to the server
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Search:', selectedFacultyName); // You can replace this with your search value

    // Reset the form fields
    setEmail('');
    setPassword('');
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link to="/">
          <Logo src="/logo.png" alt="Logo" />
        </Link>
        {subjectName && <h2 style={{ margin: '0', padding: '0' }}>{subjectName}</h2>}
      </LogoContainer>

      <div>
        <SearchBar
          type="text"
          placeholder={`Search in ${selectedFacultyName}`}
          onChange={onSearchChange}
        />
        <SearchButton>Search</SearchButton>
      </div>
      <AuthButtons>
        <Form onSubmit={handleSubmit}>
          <AuthInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <AuthInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <AuthButton type="submit">Login</AuthButton>
        </Form>
        <AuthButton>Sign Up</AuthButton>
      </AuthButtons>
    </HeaderContainer>
  );
};

export default Header;