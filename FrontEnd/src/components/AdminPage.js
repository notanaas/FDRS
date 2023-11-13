import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});

  // Fetch all faculties and their associated documents
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api_faculty/Faculties');
        setFaculties(response.data.facultyNames);
      } catch (error) {
        console.error('Failed to fetch faculties:', error);
      }
    };

    fetchFaculties();
  }, []);

  // Fetch documents for the selected faculty
  useEffect(() => {
    if (selectedFaculty) {
      const fetchDocuments = async () => {
        try {
          console.log("Selected Faculty ID:", selectedFaculty._id); // Log the selected faculty ID
          const response = await axios.get(`http://localhost:3002/api/resource/faculty/${selectedFaculty._id}`);
          console.log("Response Data:", response.data); // Log the response data
          setDocuments(response.data.Resource_list);
        } catch (error) {
          console.error('Failed to fetch documents:', error);
        }
      };
  
      fetchDocuments();
    }
  }, [selectedFaculty]);

  // Handle document approval status
  const handleApproval = (documentId, isApproved) => {
    // Update the approval status in the local state
    setApprovalStatus((prevStatus) => ({
      ...prevStatus,
      [documentId]: isApproved,
    }));

    // Send the approval status to the backend API if needed
    // You can make an API call here to update the approval status in the database
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <h2>Faculties</h2>
        {faculties.length > 0 ? (
          <ul>
            {faculties.map((faculty) => (
              <li key={faculty._id}>
                <button onClick={() => setSelectedFaculty(faculty)}>{faculty.FacultyName}</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No faculties found.</p>
        )}
      </div>
      {selectedFaculty && (
        <div>
          <h2>Documents for Faculty: {selectedFaculty.FacultyName}</h2>
          {documents.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document._id}>
                    <td>{document.ResourceTitle}</td>
                    <td>{document.Description}</td>
                    <td>
                      <select
                        onChange={(e) => handleApproval(document._id, e.target.value === 'approved')}
                        value={approvalStatus[document._id] ? (approvalStatus[document._id] ? 'approved' : 'disapproved') : ''}
                      >
                        <option value="">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="disapproved">Disapproved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No documents found for this faculty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
