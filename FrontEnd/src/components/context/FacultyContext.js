// FacultyContext.js
import React, { createContext, useState, useContext } from 'react';

const FacultyContext = createContext();

export const useFaculty = () => useContext(FacultyContext);

export const FacultyProvider = ({ children }) => {
  const [currentFaculty, setCurrentFaculty] = useState(null);

  return (
    <FacultyContext.Provider value={{ currentFaculty, setCurrentFaculty }}>
      {children}
    </FacultyContext.Provider>
  );
};
