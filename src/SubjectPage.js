import React from 'react';

const SubjectPage = ({ selectedSubject }) => {
  return (
    <div>
      {selectedSubject && (
        <div>
          <h1>Subject: {selectedSubject}</h1>
          {/* Add content related to the selected subject */}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
