import React, { useRef, useEffect } from 'react';

const ReelVideo = ({ src, autoPlay = false, ...props }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [autoPlay, src]);

  return (
    <video
      className="reel-video"
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      {...props}
    />
  );
};

export default ReelVideo;
