import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import './App.css';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    isAdmin: false,
  });
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { authToken } = useContext(AuthContext);
  const backendURL = 'http://localhost:3002';

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api_user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (response.data) {
        setProfile({
          username: response.data.profile.Username,
          email: response.data.profile.Email,
          isAdmin: response.data.profile.isAdmin
        });

        if (response.data.profile.isAdmin) {
          fetchFaculties();
        }
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchFaculties = async () => {
    setIsLoadingFaculties(true);
    try {
      const response = await axios.get(`${backendURL}/api_faculty/Faculties`);
      setFaculties(response.data.facultyNames || []);
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
    } finally {
      setIsLoadingFaculties(false);
    }
  };

  const fetchDocuments = async () => {
    if (selectedFaculty) {
      setIsLoadingDocuments(true);
      try {
        const response = await axios.get(`${backendURL}/api_resource/faculty/${selectedFaculty._id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setDocuments(response.data.Resource_list || []);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    }
  };

  const setApprovalStatus = async (documentId, isApproved) => {
    try {
      await axios.post(`${backendURL}/api_user/acceptance/${documentId}`, {
        accept: isApproved,
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      fetchDocuments(); // Refetch documents to update the list
    } catch (error) {
      console.error('Failed to set approval status:', error);
    }
  };

  const DocumentCard = ({ document }) => (
    <div className="document-card">
      <div className="document-image-container">
        {document.Cover ? (
          <img src={`${backendURL}/${document.Cover}`} alt="Document cover" className="document-image" />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
      <div className="document-content">
        <h3 className="document-title">{document.ResourceTitle}</h3>
        <p className="document-author">Author: {document.ResourceAuthorFirstName} {document.ResourceAuthorLastName}</p>
        <a href={`${backendURL}/${document.file_path}`} download>Download Document</a> 
      </div>
      <div className="document-user-info">
        <p>Uploaded by: {document.uploaderUsername || 'Username not available'}</p>
        <p>Email: {document.uploaderEmail || 'Email not available'}</p>
      </div>
      <div className="document-actions">
        <button onClick={() => setApprovalStatus(document._id, true)} className="approve-button">Approve</button>
        <button onClick={() => setApprovalStatus(document._id, false)} className="disapprove-button">Disapprove</button>
      </div>
    </div>
  );

  useEffect(() => {
    if (authToken) {
      fetchProfileData();
    }
  }, [authToken, backendURL]);

  useEffect(() => {
    fetchDocuments();
  }, [selectedFaculty, authToken, backendURL]);

  if (!profile.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-profile">
      <h1>User Profile</h1>
      <div className="user-info">
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>
      </div>
      {profile.isAdmin && (
        <div className="admin-section">
          <h2>Admin Panel</h2>
          <div>
            <h3>Faculties</h3>
            {isLoadingFaculties ? <p>Loading faculties...</p> : faculties.map((faculty) => (
              <button key={faculty._id} className="authButton" onClick={() => setSelectedFaculty(faculty)}>
                {faculty.FacultyName}
              </button>
            ))}
          </div>
          {selectedFaculty && (
            <div>
              <h3>Documents for Faculty: {selectedFaculty.FacultyName}</h3>
              {isLoadingDocuments ? <p>Loading documents...</p> : documents.map((document) => (
                <DocumentCard key={document._id} document={document} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
