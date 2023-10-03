import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send login request to the backend
    axios
      .post('/api/signup', formData) // Use your backend login endpoint
      .then((response) => {
        // Handle the response, typically storing the JWT token
        const { token } = response.data;
        localStorage.setItem('token', token);

        // Redirect to a protected route or perform other actions
        // For example, navigate to the dashboard
        window.location.href = '/dashboard';
      })
      .catch((error) => {
        // Handle login errors (e.g., incorrect credentials)
        console.error('Login failed:', error.response.data.message);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
