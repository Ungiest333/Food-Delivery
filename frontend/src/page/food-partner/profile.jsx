import React, { useState, useEffect } from "react";
import "./profile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`https://food-delivery-vigr.onrender.com/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setProfile(res.data.foodPartner);
        setVideos(res.data.foodPartner.videos); // safer
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, [id]);

  return (
    <div className="partner-profile-container">
      <div className="partner-profile-header">
        <div className="partner-profile-info">
          <div className="partner-profile-field">
            <span className="partner-profile-label" title="Restaurant name">
              {profile?.restaurantName}
            </span>
          </div>
          <div className="partner-profile-field">
            <span className="partner-profile-label" title="Address">
              {profile?.address}
            </span>
          </div>
        </div>
        <div className="partner-profile-avatar">
          <img
            src="https://plus.unsplash.com/premium_photo-1738776254643-b853838818bf?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="partner-profile-avatar-img"
            alt=""
          />
        </div>
      </div>

      <div className="partner-profile-stats">
        <div className="partner-profile-stat">
          <span className="partner-profile-stat-label">Total Meal</span>
          <span className="partner-profile-stat-value">
            {profile?.totalMeals}
          </span>
        </div>
        <div className="partner-profile-stat">
          <span className="partner-profile-stat-label">Customer Served</span>
          <span className="partner-profile-stat-value">
            {profile?.customerServe}
          </span>
        </div>
      </div>

      <hr className="partner-profile-divider" />

      <div className="partner-profile-meals">
        {!videos || videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos.map((video, index) => (
            <div key={index} className="partner-profile-meal-card">
              <video
                src={video?.url || ""}
                controls
                className="partner-profile-meal-video"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
