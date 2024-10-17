import React from 'react';

interface VideoStreamProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  facingMode: 'user' | 'environment';
}

const VideoStream: React.FC<VideoStreamProps> = ({ videoRef, facingMode }) => {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-64 object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 border-2 border-white rounded-lg"></div>
      </div>
    </div>
  );
};

export default VideoStream;