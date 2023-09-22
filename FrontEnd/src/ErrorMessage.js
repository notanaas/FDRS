import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #ff0000;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const ErrorMessage = ({ message }) => {
  return <ErrorContainer>{message}</ErrorContainer>;
};

export default ErrorMessage;
