import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReelVideo from "../../components/ReelVideo";
import Logo from "../../assets/logo/Group 1.png";


const Home = () => {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [saved, setSaved] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({}); // { foodId: [comments] }
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  // --- Scroll handler ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const vh = window.innerHeight;
      const index = Math.round(container.scrollTop / vh);
      setCurrentReelIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Auto play/pause videos ---
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentReelIndex) video.play().catch(() => {});
      else video.pause();
    });
  }, [currentReelIndex, reels]);

  // --- Fetch reels ---
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((res) =>
        setReels(Array.isArray(res.data.foodItems) ? res.data.foodItems : [])
      )
      .catch((err) => console.error("Error fetching reels:", err));
  }, []);

  // --- Fetch comments ---
  const fetchComments = async (foodId) => {
    if (!foodId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/food/${foodId}/comments`,
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [foodId]: Array.isArray(res.data) ? res.data : [],
      }));
    } catch (err) {
      console.error(
        `Error fetching comments for ${foodId}:`,
        err.response?.data || err.message
      );
      setComments((prev) => ({ ...prev, [foodId]: [] }));
    }
  };

  // --- Fetch comments when current reel changes ---
  useEffect(() => {
    const currentReel = reels[currentReelIndex];
    if (currentReel?._id) fetchComments(currentReel._id);
  }, [currentReelIndex, reels]);

  // --- Like ---
  const likeVideo = async (reel) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: reel._id },
        { withCredentials: true }
      );
      setReels((prev) =>
        prev.map((v) =>
          v._id === reel._id
            ? {
                ...v,
                likes: res.data.like
                  ? (v.likes || 0) + 1
                  : Math.max(0, (v.likes || 1) - 1),
              }
            : v
        )
      );
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  // --- Save ---
  const saveVideo = async (reel) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: reel._id },
        { withCredentials: true }
      );
      if (res.data.save) setSaved((prev) => [...prev, reel]);
      else setSaved((prev) => prev.filter((item) => item._id !== reel._id));
    } catch (err) {
      console.error("Error saving video:", err);
    }
  };

  // --- Add comment ---
  const handleCommentSubmit = async (reel) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:3000/api/food/${reel._id}/comments`,
        { text: commentText },
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [reel._id]: [...(prev[reel._id] || []), res.data],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    }
  };

  // --- Delete comment ---
  const handleDeleteComment = async (reel, commentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/food/${reel._id}/comments/${commentId}`,
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [reel._id]: prev[reel._id].filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
    }
  };

  // --- Edit comment ---
  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (reel, commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `http://localhost:3000/api/food/${reel._id}/comments/${commentId}`,
        { text: editText },
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [reel._id]: prev[reel._id].map((c) =>
          c._id === commentId ? res.data : c
        ),
      }));
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Failed to update comment");
    }
  };

  return (
    
 <div className="home-wrapper">
      {/* ✅ Sticky Header */}
      <header className="home-header">
        <img src={Logo} alt="Extra Bite Logo" className="home-logo" />
        {/* <h2 className="home-title">FOOODOOO</h2> */}
      </header>
      
    <div className="reels-container" ref={containerRef}>
      {reels.length > 0 ? (
        reels.map((reel, idx) => (
          <div className="reel" key={reel._id}>
            <ReelVideo
              src={reel.video}
              ref={(el) => (videoRefs.current[idx] = el)}
              autoPlay={idx === currentReelIndex}
            />
            

            <div className="reel-content">
              <div className="reel-actions">
                {/* Like */}
                <button className="icon-btn" onClick={() => likeVideo(reel)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="32"
                    height="32"
                  >
                    <path d="M20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736Z"></path>
                  </svg>
                  <div className="icon-label">Likes: {reel.likes || 0}</div>
                </button>

                {/* Comment */}
                <button
                  className="icon-btn"
                  onClick={() => {
                    setShowCommentBox((prev) => (prev === idx ? null : idx));
                    if (reel?._id) fetchComments(reel._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="32"
                    height="32"
                  >
                    <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
                  </svg>
                  <div className="icon-label">
                    Comments: {comments[reel._id]?.length || 0}
                  </div>
                </button>
              </div>

              {/* Comment Dialog Modal */}
              {showCommentBox !== null && reels[showCommentBox] && (
                <div
                  className="comment-dialog-overlay"
                  onClick={() => setShowCommentBox(null)}
                >
                  <div
                    className="comment-dialog"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Comments</h3>

                    {/* Comment Input */}
                    <div className="comment-input">
                      <input
                        type="text"
                        autoFocus
                        value={editingCommentId ? editText : commentText}
                        onChange={(e) =>
                          editingCommentId
                            ? setEditText(e.target.value)
                            : setCommentText(e.target.value)
                        }
                        placeholder={
                          editingCommentId
                            ? "Edit your comment..."
                            : "Add a comment..."
                        }
                      />
                      {editingCommentId ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateComment(
                                reels[showCommentBox],
                                editingCommentId
                              )
                            }
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditText("");
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            handleCommentSubmit(reels[showCommentBox])
                          }
                        >
                          Post
                        </button>
                      )}
                    </div>

                    {/* Comment List */}
                    <div className="comment-list">
                      {(comments[reels[showCommentBox]._id] || []).map((c) => (
                        <div key={c._id} className="comment-item">
                          <b>{c.user?.fullName || "User"}:</b> {c.text}
                          <div className="comment-actions">
                            <button onClick={() => startEditComment(c)}>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  reels[showCommentBox],
                                  c._id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="close-btn"
                      onClick={() => setShowCommentBox(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="reel-description">{reel.description}</div>
              <Link
                className="reel-button "
                to={`/food-partner/${reel.foodPartner || reel._id}`}
              >
                Visit Store
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="no-reels">No reels available</div>
      )}

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="32"
            height="32"
          >
            <path d="M13 19H19V9.97815L12 4.53371L5 9.97815V19H11V13H13V19ZM21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z"></path>
          </svg>
          <div className="nav-label">Home</div>
        </button>

        <button
          className="nav-btn"
          onClick={() => saveVideo(reels[currentReelIndex])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="32"
            height="32"
          >
            <path d="M6 2C5.44772 2 5 2.44772 5 3V21.382C5 21.9362 5.61862 22.2672 6.08579 21.9472L12 17.882L17.9142 21.9472C18.3814 22.2672 19 21.9362 19 21.382V3C19 2.44772 18.5523 2 18 2H6Z"></path>
          </svg>
          <div className="nav-label">Save</div>
        </button>
      </nav>
    </div>
    </div>
  );
};

export default Home;
