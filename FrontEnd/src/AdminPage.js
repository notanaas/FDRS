import React, { useState } from 'react';
import { useTheme } from './ThemeContext'; // Import useTheme from your ThemeContext

const AdminPage = () => {
  const { isDarkMode } = useTheme();
  const [documents, setDocuments] = useState([]); // State for storing documents
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
  });

  // Function to handle approving a document
  const approveDocument = (documentId) => {
    // Implement logic to mark the document as approved in your database
  };

  // Function to handle admin login
  const handleAdminLogin = () => {
    // Implement logic to validate admin credentials and set a session/token
  };

  return (
    <div className={`admin-page ${isDarkMode ? 'dark' : 'light'}`}>
      <h1>Admin Page</h1>
      <div className="admin-login">
        <input
          type="text"
          placeholder="Username"
          value={adminCredentials.username}
          onChange={(e) =>
            setAdminCredentials({
              ...adminCredentials,
              username: e.target.value,
            })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={adminCredentials.password}
          onChange={(e) =>
            setAdminCredentials({
              ...adminCredentials,
              password: e.target.value,
            })
          }
        />
        <button onClick={handleAdminLogin}>Login</button>
      </div>
      <div className="document-list">
        {documents.map((document) => (
          <div key={document.id}>
            <p>{document.title}</p>
            <p>{document.description}</p>
            <button onClick={() => approveDocument(document.id)}>Approve</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
