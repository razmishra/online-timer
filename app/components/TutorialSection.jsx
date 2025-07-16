import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize2 } from 'lucide-react';

const TutorialSection = (props) => {
  const {isPlaying, isHovered, setIsPlaying, setIsHovered, hasError, setHasError, isLoading, setIsLoading} = props;
  
  // Alternative video URLs to try
  const videoSources = [
    {
      url: "https://imagekit.io/player/embed/igskq7bn8/Untitled%20video%20-%20Made%20with%20Clipchamp%20(53).mp4?autoplay=false&controls=true&muted=false",
      type: "ImageKit"
    },
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const currentVideo = videoSources[currentVideoIndex];

  // Set a timeout to hide loading after a reasonable time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setVideoLoaded(true);
      }
    }, 3000); // Hide loading after 3 seconds max

    return () => clearTimeout(timer);
  }, [isLoading, setIsLoading]);

  // Handle iframe load - this may not fire for embedded players
  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setVideoLoaded(true);
  };

//   // Handle iframe error
  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    setVideoLoaded(false);
    console.error(`Failed to load video from ${currentVideo.type}`);
  };

//   const tryNextVideo = () => {
//     if (currentVideoIndex < videoSources.length - 1) {
//       setCurrentVideoIndex(currentVideoIndex + 1);
//       setIsLoading(true);
//       setHasError(false);
//       setVideoLoaded(false);
//     }
//   };

//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

  return (
    <section className="relative px-4 sm:px-6 py-16 sm:py-20 md:py-28 w-full max-w-7xl mx-auto">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 animate-pulse -z-10 rounded-none md:rounded-3xl" />
      
      <div className="relative bg-white/90 backdrop-blur-sm rounded-none md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 transition-all duration-700 hover:shadow-3xl">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 px-2">
            How to Use ShareMyTimer
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Watch this quick tutorial to see how easy it is to create, control, and share real-time timers for your team, event, or classroom.
          </p>
        </div>

        {/* Browser Tab Interface */}
        <div className="w-full max-w-6xl mx-auto animate-fade-in animation-delay-300">
          {/* Browser Header */}
          <div className="bg-gray-100 rounded-t-xl sm:rounded-t-2xl px-3 sm:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3 border-b border-gray-200">
            {/* Window Controls */}
            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer"></div>
            </div>
            
            {/* Tab and URL Bar */}
            <div className="flex-1 min-w-0 bg-white rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 flex items-center space-x-2 overflow-hidden">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="truncate">sharemytimer.live</span>
              {isPlaying && <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 flex-shrink-0" />}
            </div>
          </div>

          {/* Video Container - Fixed container with proper aspect ratio */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-b-xl sm:rounded-b-2xl overflow-hidden shadow-2xl">
            {/* Aspect ratio container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              
              {/* Loading State - Only show if actually loading and not loaded yet */}
              {isLoading && !videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                  <div className="text-center text-white p-4">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base">Loading video...</p>
                  </div>
                </div>
              )}

              {/* Video Iframe - Always render, but may be hidden by loading overlay */}
              <iframe
                src={currentVideo.url}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                title="ShareMyTimer Tutorial Video"
                onLoad={handleVideoLoad}
                onError={handleVideoError}
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TutorialSection;