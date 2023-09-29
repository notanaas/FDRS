import React, { createContext, useContext, useState } from 'react';

const FacultyContext = createContext();

export function FacultyProvider({ children }) {
  const [facultyName, setFacultyName] = useState('');

  return (
    <FacultyContext.Provider value={{ facultyName, setFacultyName }}>
      {children}
    </FacultyContext.Provider>
  );
}

export function useFaculty() {
  return useContext(FacultyContext);
}
