import React from 'react';
import { useParams } from 'react-router-dom';

const SubjectPage = (props) => {
  const { selectedFaculty } = props.match.params; // Get the selectedFaculty parameter from the route
  const { subjectName } = useParams(); // Get the subjectName parameter from the route

  // Use selectedFaculty and subjectName to display content
  return (
    <div>
      <h1>Subject: {subjectName}</h1>
      <p>Faculty: {selectedFaculty}</p>
      {/* Add content related to the subject */}
    </div>
  );
};

export default SubjectPage;
