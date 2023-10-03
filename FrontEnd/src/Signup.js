import React, { useState } from 'react';
import axios from 'axios'; // Make sure Axios is imported

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send signup data to the backend
    axios
      .post('/api/signup', formData) // Use your backend signup endpoint
      .then((response) => {
        // Handle the response, e.g., display a success message
        console.log('Signup successful:', response.data.message);
        // You can also navigate the user to a different page or show a success message here
      })
      .catch((error) => {
        // Handle signup errors, e.g., display validation errors or duplicate user errors
        console.error('Signup failed:', error.response.data.errors);
        // You can also display error messages to the user on the form
      });
  };

  return (
    <div className={`popup ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="popup-content">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>
        <button className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Signup;
