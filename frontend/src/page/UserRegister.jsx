import React from "react";
import "../App.css";
import axios from "axios";
import { useNavigate} from "react-router-dom";

export default function UserRegister() {
    
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const phone = e.target.phone.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("https://food-delivery-vigr.onrender.com/api/auth/user/register", {
        fullName: firstName + " " + lastName,
        email,
        password,
        phone,
        confirmPassword,
      }, {
        withCredentials: true
      });

      console.log("Registered successfully:", res.data);
      navigate("/")
      alert("Registration successful!");
    
    } catch (err) {
      console.error(" Registration error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <div className="form-title">User Register</div>

        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" autoComplete="given-name" />
        </div>

        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" autoComplete="family-name" />
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
        <a className="link" href="/user/login">Already have an account? Login</a>
      </form>
    </div>
  );
}
