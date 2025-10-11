import React from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate} from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const response = await axios.post('https://food-delivery-vigr.onrender.com/api/auth/user/login', {
        email,
        password
      },{ withCredentials: true });
      console.log('Login successful:', response.data);
      // Example: redirect on success
      if (response.data.success) {
        navigate('/');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error');
    }
  };
  return (
    <div className="page-container">
  <form className="form-box" onSubmit={handleSubmit}>
        <div className="form-title">User Login</div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" autoComplete="current-password" />
        </div>
        <button className="button" type="submit">Login</button>
        <a className="link" href="/user/register">Register as a normal user</a>
        <a className="link" href="/food-partner/register">Register as food partner</a>
      </form>
    </div>
  );
}
