import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const setApprovalStatus = (documentId, isApproved) => {
    // Handle approval logic here
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setIsLoadingFaculties(true);
        const response = await axios.get('http://localhost:3002/api_faculty/Faculties');
        if (response.data && response.data.facultyNames) {
          setFaculties(response.data.facultyNames);
        } else {
          setFaculties([]);
        }
      } catch (error) {
        console.error('Failed to fetch faculties:', error);
        setFaculties([]);
      } finally {
        setIsLoadingFaculties(false);
      }
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      const fetchDocuments = async () => {
        try {
          setIsLoadingDocuments(true);
          console.log("Selected Faculty ID:", selectedFaculty._id);
          const response = await axios.get(`http://localhost:3002/api_resource/faculty/${selectedFaculty._id}`);
          console.log("Response Data:", response.data);
  
          if (response.data && response.data.Resource_list) {
            setDocuments(response.data.Resource_list);
          } else {
            setDocuments([]);
          }
        } catch (error) {
          console.error('Failed to fetch documents:', error);
        } finally {
          setIsLoadingDocuments(false);
        }
      };
  
      fetchDocuments();
    }
  }, [selectedFaculty]);
  

  const DocumentCard = ({ document }) => (
    <div className="document-card">
      <div className="document-image-container">
        {document.Cover ? ( 
          <img src={`http://localhost:3002/${document.Cover}`} alt="Document" className="document-image" />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
      <div className="document-content">
        <h3 className="document-title">{document.ResourceTitle}</h3>
        <p className="document-author">{document.ResourceAuthor ? `Author: ${document.ResourceAuthor}` : 'Author not provided'}</p>
        <a href={`http://localhost:3002/${document.file_path}`} download>Download Document</a> 
      </div>
      <div className="document-actions">
        <button onClick={() => setApprovalStatus(document._id, true)} className="approve-button">Approve</button>
        <button onClick={() => setApprovalStatus(document._id, false)} className="disapprove-button">Disapprove</button>
      </div>
    </div>
  );

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <h2>Faculties</h2>
        {isLoadingFaculties ? (
          <p>Loading faculties...</p>
        ) : (
          faculties && faculties.length > 0 ? (
            faculties.map((faculty) => (
              <button key={faculty._id} className="authButton" onClick={() => setSelectedFaculty(faculty)}>
                {faculty.FacultyName}
              </button>
            ))
          ) : (
            <p>No faculties found.</p>
          )
        )}
      </div>
      {selectedFaculty && (
        <div>
          <h2>Documents for Faculty: {selectedFaculty.FacultyName}</h2>
          {isLoadingDocuments ? (
            <p>Loading documents...</p>
          ) : (
            documents && documents.length > 0 ? (
              documents.map((document) => (
                <DocumentCard key={document._id} document={document} />
              ))
            ) : (
              <p>No documents found for this faculty.</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
