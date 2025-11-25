'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';

interface VideoScrollExpandProps {
  videoSrc?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  usePreloadedVideo?: boolean;
}

const VideoScrollExpand = ({ 
  videoSrc, 
  title, 
  subtitle,
  children,
  usePreloadedVideo = true
}: VideoScrollExpandProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mainVideo } = useVideo();
  
  // בחירה בין וידאו מוקדם לוידאו רגיל
  const shouldUsePreloaded = usePreloadedVideo && mainVideo.isReady;
  const finalVideoUrl = shouldUsePreloaded ? mainVideo.videoUrl : (videoSrc?.startsWith('/') ? videoSrc : '/Families_tell_stories/1 - כמות הדגים הייתה גדולה ובאיכות מאד טובה.mp4');
  const loading = usePreloadedVideo ? mainVideo.loading : false;
  const error = usePreloadedVideo ? mainVideo.error : null;
  
  // זיהוי מסכים קטנים
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      let progress = 0;
      
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        progress = Math.min(visibleHeight / (windowHeight * 0.4), 1);
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // חישוב גודל הוידאו
  const baseScale = isMobile ? 0.8 : 0.3;
  const videoScale = baseScale + (scrollProgress * (1 - baseScale)); 
  const videoOpacity = 0.85 + (scrollProgress * 0.15);

  // פונקציית ניגון פשוטה
  const togglePlay = async () => {
    console.log('🎬 togglePlay - isMobile:', isMobile, 'isPlaying:', isPlaying);
    
    if (!videoRef.current || !finalVideoUrl) {
      console.log('❌ אין וידאו או URL');
      return;
    }
    
    try {
      if (isPlaying) {
        console.log('⏸️ עוצר וידאו');
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('▶️ מתחיל וידאו');
        
        if (isMobile) {
          // הגדרות פשוטות למובייל
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
        } else {
          videoRef.current.muted = false;
        }
        
        await videoRef.current.play();
        setIsPlaying(true);
        console.log('✅ וידאו מתנגן');
      }
    } catch (error) {
      console.error('❌ שגיאה:', error);
      
      // ניסיון עם muted
      try {
        videoRef.current.muted = true;
        await videoRef.current.play();
        setIsPlaying(true);
        console.log('✅ עובד עם muted');
      } catch (e) {
        console.error('💥 נכשל לגמרי:', e);
      }
    }
  };

  // הצגת כפתורי בקרה
  useEffect(() => {
    if (isPlaying && !isHovering && !isMobile) {
      setShowControls(false);
    } else {
      setShowControls(true);
    }
  }, [isPlaying, isHovering, isMobile]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* כותרות */}
        <motion.div
          className="mb-8 text-center z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title && (
            <motion.h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2a2b26] font-staff leading-tight">
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2a2b26]/80 font-staff">
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {/* וידאו */}
        <motion.div
          className="relative mx-auto rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
          style={{
            width: isMobile ? `${Math.max(videoScale * 90, 85)}vw` : `${videoScale * 80}vw`,
            height: isMobile ? `${Math.max(videoScale * 50, 48)}vw` : `${videoScale * 45}vw`,
            maxWidth: isMobile ? '95vw' : '1200px',
            maxHeight: isMobile ? '53vw' : '675px',
            minWidth: isMobile ? '320px' : '300px',
            minHeight: isMobile ? '180px' : '169px',
          }}
          animate={{
            scale: videoScale,
            opacity: videoOpacity,
          }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={togglePlay}
          onMouseEnter={() => !isMobile && setIsHovering(true)}
          onMouseLeave={() => !isMobile && setIsHovering(false)}
        >
          {loading ? (
            <div className="flex justify-center items-center w-full h-full bg-gray-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a2b26] mx-auto mb-4"></div>
                <p className="text-[#2a2b26] font-staff">טוען וידאו...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center w-full h-full bg-red-100">
              <div className="text-center">
                <p className="mb-2 text-red-600 font-staff">שגיאה בטעינת הוידאו</p>
                <p className="text-sm text-red-500 font-staff">{error}</p>
              </div>
            </div>
          ) : finalVideoUrl ? (
            <div className="relative w-full h-full">
              {/* רקע למובייל */}
              {isMobile && !isPlaying && (
                <div 
                  className="absolute inset-0 flex justify-center items-center bg-center bg-cover"
                  style={{
                    backgroundImage: 'url(/tumbil.png)',
                    backgroundColor: '#f5a383'
                  }}
                >
                  <div className="flex justify-center items-center w-full h-full bg-black/30">
                    <div className="p-6 rounded-full shadow-2xl backdrop-blur-sm cursor-pointer bg-white/95">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#2a2b26]"
                      >
                        <path d="M8 5v14l11-7z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {/* וידאו */}
              <video
                ref={videoRef}
                src={finalVideoUrl}
                loop
                playsInline
                muted={isMobile}
                preload={isMobile ? "auto" : "metadata"}
                controls={false}
                disablePictureInPicture
                className={`object-cover w-full h-full ${
                  isMobile && !isPlaying ? 'opacity-0' : 'opacity-100'
                }`}
              />
              
              {/* כפתור play במרכז */}
              <AnimatePresence>
                {showControls && !isPlaying && (
                  <motion.div
                    className="absolute inset-0 flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className={`rounded-full shadow-2xl backdrop-blur-sm bg-white/90 cursor-pointer ${
                        isMobile ? 'p-8' : 'p-6'
                      }`}
                      whileHover={{ scale: isMobile ? 1 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                    >
                      <Play size={isMobile ? 56 : 48} className="text-[#2a2b26] ml-2" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* אוברליי */}
              <div 
                className="absolute inset-0 pointer-events-none bg-black/20"
                style={{ opacity: 1 - scrollProgress * 0.5 }}
              />
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* תוכן נוסף */}
      <motion.div
        className="relative z-10 bg-[#fdf6ed] min-h-[90vh] sm:min-h-screen py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0.7 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default VideoScrollExpand;
