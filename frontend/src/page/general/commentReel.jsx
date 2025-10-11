import React, { useState, useEffect } from "react";
import { fetchComments, addComment, deleteComment } from "./commentApi";

const ReelComments = ({ foodId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments when component mounts or foodId changes
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(foodId, token);
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    loadComments();
  }, [foodId, token]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await addComment(foodId, newComment, token);
      setComments((prev) => [...prev, res]); // append new comment
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(foodId, commentId, token);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="reel-comments">
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <strong>{comment.user?.name || "User"}:</strong> {comment.text}
            {comment.user?._id === token.userId && (
              <button
                type="button"
                onClick={() => handleDeleteComment(comment._id)}
                className="btn-delete"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="no-comments">No comments yet.</p>
        )}
      </div>

      <div className="add-comment">
        <label htmlFor={`comment-input-${foodId}`} className="sr-only">
          Add a comment
        </label>
        <input
          type="text"
          id={`comment-input-${foodId}`}
          name="comment"
          autoComplete="off"
          value={newComment}
          placeholder="Add a comment..."
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button type="button" onClick={handleAddComment} className="btn-post">
          Post
        </button>
      </div>
    </div>
  );
};

export default ReelComments;
