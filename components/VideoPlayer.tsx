
import React, { useEffect, useState } from 'react';
import { VideoCameraIcon } from './icons';

interface VideoPlayerProps {
  videoUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const loadingMessages = [
    "Warming up the AI's creative engine...",
    "AI is storyboarding your scene...",
    "Rendering high-quality frames... this may take a few minutes.",
    "Compositing the final video...",
    "Adding the final polish..."
];

const LoadingState: React.FC<{ message: string }> = ({ message }) => {
    const [currentTip, setCurrentTip] = useState(loadingMessages[0]);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTip(prevTip => {
                const currentIndex = loadingMessages.indexOf(prevTip);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 text-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-600 h-12 w-12 mb-4" style={{borderTopColor: '#6366f1'}}></div>
            <h3 className="text-lg font-semibold text-white">{message}</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">{currentTip}</p>
        </div>
    )
};


const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isLoading, loadingMessage, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message={loadingMessage}/>;
    }
    if (error) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 border-2 border-red-500/50 rounded-lg p-4 text-center">
          <p className="font-semibold text-red-400">Generation Failed</p>
          <p className="text-sm text-gray-300 mt-1">{error}</p>
        </div>
      );
    }
    if (videoUrl) {
      return (
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain rounded-lg bg-black"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50 border-2 border-gray-700 border-dashed rounded-lg p-4 text-center">
        <VideoCameraIcon className="h-16 w-16 text-gray-600 mb-4"/>
        <h3 className="text-lg font-semibold text-gray-300">Your Video Output</h3>
        <p className="text-sm text-gray-500 mt-1">The generated video will appear here once ready.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-2 rounded-lg shadow-lg border border-gray-700 aspect-video lg:aspect-auto lg:h-full">
      {renderContent()}
    </div>
  );
};

export default VideoPlayer;
