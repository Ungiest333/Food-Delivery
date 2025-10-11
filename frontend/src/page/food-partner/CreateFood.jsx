import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./CreateFood.css";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setVideo(null);
    setName("");
    setDescription("");
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!video || !name || !description) {
      alert("Please fill all fields before submitting!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("name", name);
      formData.append("description", description);

      const response = await axios.post(
        "https://food-delivery-vigr.onrender.com/api/food",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Food created:", response.data);
      navigate("/"); // ✅ navigate only after success
    } catch (error) {
      console.error("Error creating food:", error);
      alert("Failed to create food. Check console for details.");
    }
  };

  return (
    <div className="create-food-container">
      <form className="create-food-form" onSubmit={onSubmit}>
        <h2 className="form-title">Create Food Item</h2>

        <label className="form-label">
          Video
          <input
            type="file"
            accept="video/*"
            className="form-input visually-hidden"
            ref={fileInputRef}
            onChange={(e) => setVideo(e.target.files[0])}
          />
          <button
            type="button"
            className="video-upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <span className="video-upload-icon">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="7" width="15" height="10" rx="2" />
                <polygon points="17,12 22,15 22,9" fill="currentColor" />
              </svg>
            </span>
            <span>{video ? video.name : "Upload Video"}</span>
          </button>
        </label>

        <label className="form-label">
          Name
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter food name"
            required
          />
        </label>

        <label className="form-label">
          Description
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={3}
            required
          />
        </label>

        <button type="submit" className="form-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateFood;
