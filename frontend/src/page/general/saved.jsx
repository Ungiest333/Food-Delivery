import React, { useEffect, useRef, useState } from 'react';
import './Home.css'; // reuse styles
import axios from 'axios';
import ReelVideo from '../../components/ReelVideo';

const Saved = () => {
  const [savedItems, setSavedItems] = useState([]);
  const videoRefs = useRef([]);

  // Fetch saved items from localStorage or API on mount
  useEffect(() => {
   const response = axios.get('https://food-delivery-vigr.onrender.com/api/food/save', { withCredentials: true })
   .then(response=>{

   const savedFoods = response.data.savedFoods.map((item) => ({
    _id: item.food._id,
    video: item.food.video,
    description: item.food.description,
    likes: item.food.likeCount || 0,
    saves: item.food.saveCount || 0,

   })
   
   
  )
    setSavedItems(savedFoods);
})

  }, [])


  // Auto-pause all videos except the first one
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === 0) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [savedItems]);

  return (
    <div className="saved-container">
      <h2>Saved Items</h2>
      {savedItems && savedItems.length > 0 ? (
        savedItems.map((item, idx) => (
          <div className="reel" key={idx}>
            <ReelVideo
              src={item.video}
              autoPlay={idx === 0}
              controls
            />
            <div className="reel-content">
              <div className="reel-description">{item.description}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-reels">No saved items</div>
      )}
    </div>
  );
};

export default Saved;