import React from 'react';
import { useParams } from 'react-router-dom';
import FileUpload from './FileUpload'; // Import your FileUpload component

const SubjectPage = () => {
  const { subjectName } = useParams(); // Get the subject name from URL parameters

  return (
    <div>
      <h1>{subjectName} Subject Page</h1>
      <FileUpload subject={subjectName} /> {/* Pass the subject name as a prop */}
      {/* Add other content for the subject page */}
    </div>
  );
};

export default SubjectPage;
