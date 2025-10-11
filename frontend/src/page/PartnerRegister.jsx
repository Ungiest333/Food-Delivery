import React from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate} from "react-router-dom";
export default function PartnerRegister() {
  const navigate = useNavigate();
 const handleSubmit = async (e) => {
  e.preventDefault();

  const contactName = e.target.contactName.value;
  const restaurantName = e.target.restaurant.value;
  const address = e.target.address.value;
  const phone = e.target.phone.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const confirmPassword = e.target.confirmPassword.value;

  try {
    const response = await axios.post(
      "https://food-delivery-vigr.onrender.com/api/auth/foodpartner/register", 
      { contactName, restaurantName, address, phone, email, password, confirmPassword },
      { withCredentials: true }
    );

    if (response.data.success) {
      alert("Registration successful!");
      navigate("/create-food");
    } else {
      alert(response.data.message || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("Error during registration");
  }
};

  return (
    <div className="page-container">
  <form className="form-box" onSubmit={handleSubmit}>
        <div className="form-title">Food Partner Register</div>
          <div className="input-group">
            <label htmlFor="contactName">Contact Name</label>
            <input type="text" id="contactName" name="contactName" autoComplete="name" />
          </div>
        <div className="input-group">
          <label htmlFor="restaurant">Restaurant Name</label> 
          <input type="text" id="restaurant" name="restaurant" autoComplete="organization" />
        </div>
        <div className="input-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" autoComplete="street-address" />
        </div>
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" name="phone" autoComplete="tel" />
          </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" autoComplete="new-password" />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" />
        </div>
        <button className="button" type="submit">Register</button>
        <a className="link" href="/food-partner/login">Already have an account? Login</a>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="button" style={{ background: 'var(--color-primary)', color: '#fff' }} onClick={() => window.location.href='/user/register'}>
            Register as normal user
          </button>
          <button type="button" className="button" style={{ background: 'var(--color-primary)', color: '#fff' }} onClick={() => window.location.href='/food-partner/register'}>
            Register as food partner
          </button>
        </div>
      </form>
    </div>
  );
}
