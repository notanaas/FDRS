// Create a file, e.g., SubjectContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context
const SubjectContext = createContext();

// Create a provider component
export function SubjectProvider({ children }) {
  const [subjectName, setSubjectName] = useState(''); // Initialize with your default value

  return (
    <SubjectContext.Provider value={{ subjectName, setSubjectName }}>
      {children}
    </SubjectContext.Provider>
  );
}

// Create a custom hook to use the context
export function useSubject() {
  return useContext(SubjectContext);
}
