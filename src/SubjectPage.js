import React from 'react';
import { useParams } from 'react-router-dom';

const SubjectPage = ({ selectedSubject }) => {
  const { subjectName } = useParams();

  return (
    <div>
      <h1>Subject: {subjectName}</h1>
      {selectedSubject && <p>Selected Subject: {selectedSubject}</p>}
    </div>
  );
};

export default SubjectPage;
