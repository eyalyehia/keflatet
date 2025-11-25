'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';

interface VideoScrollExpandProps {
  videoSrc?: string; // אופציונלי - אם לא מועבר ישתמש בוידאו מהקונטקסט
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  usePreloadedVideo?: boolean; // האם להשתמש בוידאו הטעון מראש
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
  
  // Debug logging
  console.log('VideoScrollExpand Debug:', {
    shouldUsePreloaded,
    mainVideoIsReady: mainVideo.isReady,
    mainVideoUrl: mainVideo.videoUrl,
    mainVideoLoading: mainVideo.loading,
    mainVideoError: mainVideo.error,
    finalVideoUrl,
    loading,
    error
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // חישוב התקדמות הגלילה
      let progress = 0;
      
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        // כאשר הקומפוננטה נראית על המסך
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        progress = Math.min(visibleHeight / (windowHeight * 0.4), 1);
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // קריאה ראשונית
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // חישוב גודל הוידאו בהתאם לגלילה - שיפור למובייל
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640; // שינוי ל-640px
  const baseScale = isMobile ? 0.8 : 0.3; // התחלה גדולה יותר במובייל
  const videoScale = baseScale + (scrollProgress * (1 - baseScale)); 
  const videoOpacity = 0.85 + (scrollProgress * 0.15);

  // פונקציות לניהול הוידאו - גישה פשוטה למסכים קטנים
  const togglePlay = async () => {
    console.log('🎬 togglePlay נקרא - isMobile:', isMobile, 'isPlaying:', isPlaying);
    
    if (!videoRef.current) {
      console.log('❌ videoRef.current לא קיים');
      return;
    }
    
    if (!finalVideoUrl) {
      console.log('❌ אין URL לוידאו');
      return;
    }
    
    console.log('🎯 משתמש ב-URL:', finalVideoUrl);
    
    try {
      if (isPlaying) {
        // השהיית הוידאו
        console.log('⏸️ משה את הוידאו');
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // התחלת ניגון
        console.log('▶️ מתחיל לנגן וידאו');
        
        if (isMobile) {
          // גישה פשוטה למסכים קטנים
          console.log('📱 ניגון במסך קטן');
          
          // הגדרות בסיסיות למובייל
          videoRef.current.muted = true;
          videoRef.current.controls = false;
          videoRef.current.playsInline = true;
          
          // ניסיון ניגון פשוט
          await videoRef.current.play();
          setIsPlaying(true);
          console.log('✅ וידאו התחיל לנגן במסך קטן');
          
        } else {
          // דסקטופ
          console.log('💻 ניגון בדסקטופ');
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsPlaying(true);
          console.log('✅ וידאו התחיל לנגן בדסקטופ');
        }
      }
    } catch (error) {
      console.error('❌ שגיאה בניגון הוידאו:', error);
      
      // ניסיון חירום עם muted
      if (videoRef.current && !isPlaying) {
        try {
          console.log('🔄 מנסה שוב עם muted...');
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsPlaying(true);
          console.log('✅ הצליח לנגן עם muted');
        } catch (mutedError) {
          console.error('💥 נכשל בניגון גם עם muted:', mutedError);
        }
      }
    }
  };

  // טיפול בטעינת הוידאו ושיפור למובייל
  useEffect(() => {
    const video = videoRef.current;
    if (video && finalVideoUrl) {
      const handleCanPlay = () => {
        console.log('וידאו מוכן לניגון');
        // הבטחה שהוידאו יציג את הפריים הראשון
        if (video.currentTime !== 0) {
          video.currentTime = 0;
        }
      };
      
      const handleLoadedData = () => {
        console.log('נתוני הוידאו נטענו');
        // הבטחה שהוידאו יתחיל מהפריים הראשון
        if (video.currentTime !== 0) {
          video.currentTime = 0;
        }
      };
      
      const handleError = (e: Event) => {
        console.error('שגיאה בטעינת הוידאו:', e);
        console.error('פרטי השגיאה:', {
          videoUrl: finalVideoUrl,
          readyState: video.readyState,
          networkState: video.networkState,
          error: video.error
        });
      };
      
      const handleLoadStart = () => {
        console.log('התחלת טעינת הוידאו');
      };
      
      const handleLoadedMetadata = () => {
        console.log('מטאדטה נטענה - מציג פריים ראשון');
        // הבטחה שהוידאו יציג את הפריים הראשון מיד
        video.currentTime = 0;
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      video.addEventListener('loadstart', handleLoadStart);
      
      // שיפור למובייל - הגדרת אטריבוטים דינמית
      if (isMobile) {
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        // טעינה מוקדמת במובייל רק כשהוידאו נראה על המסך
        if (scrollProgress > 0) {
          video.load();
        }
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
      };
    }
  }, [finalVideoUrl, isMobile, scrollProgress]);

  // הצגת כפתורי בקרה כשמרחפים או כשהוידאו מושהה
  useEffect(() => {
    if (isPlaying && !isHovering && !isMobile) {
      // בדסקטופ: אם מנגן ולא מרחפים, הסתר מיד
      setShowControls(false);
    } else {
      // במובייל או אם מושהה/מרחפים, הצג את הכפתורים
      setShowControls(true);
    }
  }, [isPlaying, isHovering, isMobile]);

  return (
    <div 
      ref={containerRef}
      className="relative mt-[-300px] sm:mt-[-70px] min-h-[90vh] sm:min-h-[100vh] overflow-x-hidden"
    >
      {/* סקציית הוידאו הראשונה */}
      <div className="flex overflow-hidden sticky top-0 justify-center items-center mb-0 sm:mb-0 md:mb-4 lg:mb-16 h-[80vh] sm:h-screen">
        <div className="text-center">
          {/* כותרות */}
          <motion.div
            className="mb-2 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1 - scrollProgress * 0.5, y: -scrollProgress * 50 }}
            transition={{ duration: 0.1 }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2a2b26] font-staff mb-2 sm:mb-4"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                textShadow: scrollProgress > 0.3 ? "0 0 20px rgba(245, 163, 131, 0.5)" : "none"
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.2
              }}
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 30px rgba(245, 163, 131, 0.8)"
              }}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2a2b26]/80 font-staff"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  color: scrollProgress > 0.5 ? "rgba(42, 43, 38, 0.9)" : "rgba(42, 43, 38, 0.8)"
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: 0.4
                }}
                whileHover={{ 
                  color: "rgba(42, 43, 38, 1)",
                  x: 5
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>

          {/* הוידאו */}
          <motion.div
            className="overflow-hidden relative mx-auto rounded-2xl shadow-2xl cursor-pointer"
            style={{
              width: isMobile 
                ? `${Math.max(videoScale * 90, 85)}vw` // 85-90vw במובייל
                : `${videoScale * 80}vw`, // 24-80vw בדסקטופ
              height: isMobile 
                ? `${Math.max(videoScale * 50, 48)}vw` // aspect ratio 16:9 במובייל
                : `${videoScale * 45}vw`,
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
            onMouseEnter={() => !isMobile && setIsHovering(true)}
            onMouseLeave={() => !isMobile && setIsHovering(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('📱 לחצו על מיכל הוידאו (click)');
              togglePlay();
            }}
            onTouchStart={(e) => {
              if (isMobile) {
                e.preventDefault();
                setIsHovering(true);
              }
            }}
            onTouchEnd={(e) => {
              if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 לחצו על מיכל הוידאו (touch)');
                togglePlay();
                setTimeout(() => setIsHovering(false), 2000);
              }
            }}
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
                {/* Background image למובייל עד שמתחילים לנגן */}
                {isMobile && !isPlaying && (
                  <div 
                    className="flex absolute inset-0 justify-center items-center bg-center bg-no-repeat bg-cover"
                    style={{
                      backgroundImage: 'url(/tumbil.png)',
                      backgroundColor: '#f5a383'
                    }}
                  >
                    {/* אוברליי עם כפתור play */}
                    <div 
                      className="flex justify-center items-center w-full h-full bg-black/30"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('📱 לחצו על כפתור Play ברקע');
                        togglePlay();
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('📱 Touch על כפתור Play ברקע');
                        togglePlay();
                      }}
                    >
                      <div 
                        className="p-6 rounded-full shadow-2xl backdrop-blur-sm cursor-pointer bg-white/95"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('📱 לחצו על כפתור Play ברקע');
                          togglePlay();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('📱 Touch על כפתור Play ברקע');
                          togglePlay();
                        }}
                      >
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#2a2b26]"
                        >
                          <path
                            d="M8 5v14l11-7z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  src={finalVideoUrl}
                  loop
                  playsInline={true}
                  webkit-playsinline={true}
                  muted={isMobile ? true : false}
                  preload={isMobile ? "auto" : "metadata"}
                  controls={false}
                  disablePictureInPicture={true}
                  autoPlay={false}
                  className={`object-cover w-full h-full ${
                    isMobile && !isPlaying ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{
                    minHeight: '100%',
                    width: '100%',
                    transition: 'opacity 0.3s ease'
                  }}
                  onLoadStart={() => {
                    console.log('וידאו מתחיל לטעון');
                  }}
                  onLoadedMetadata={() => {
                    console.log('מטאדטה של הוידאו נטענה');
                  }}
                  onCanPlay={() => {
                    console.log('וידאו מוכן לניגון');
                  }}
                  onPlay={() => {
                    console.log('וידאו התחיל לנגן');
                    setIsPlaying(true);
                  }}
                  onPause={() => {
                    console.log('וידאו הושהה');
                    setIsPlaying(false);
                  }}
                  onError={(e) => {
                    console.error('שגיאה בוידאו:', e);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('לחצו על הוידאו עצמו');
                    togglePlay();
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full bg-gray-300">
                <p className="text-[#2a2b26] font-staff">אין וידאו זמין</p>
              </div>
            )}

            {/* כפתור Play/Pause במרכז */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  className="flex absolute inset-0 justify-center items-center"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ 
                    opacity: 1, 
                    x: isPlaying ? 200 : 0 // זז ימינה כשלוחצים play
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 200, // יוצא ימינה
                    scale: 0.8 
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    className={`rounded-full shadow-2xl backdrop-blur-sm bg-white/90 cursor-pointer ${
                      isMobile ? 'p-8' : 'p-6'
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: isPlaying ? 0.6 : 1, 
                      opacity: isPlaying ? 0 : 1 
                    }}
                    whileHover={{ scale: isMobile ? 1 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25 
                    }}
                    style={{
                      minWidth: isMobile ? '80px' : '60px',
                      minHeight: isMobile ? '80px' : '60px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('לחצו על כפתור Play במרכז');
                      togglePlay();
                    }}
                  >
                    {isPlaying ? (
                      <Pause size={isMobile ? 56 : 48} className="text-[#2a2b26] ml-1" />
                    ) : (
                      <Play size={isMobile ? 56 : 48} className="text-[#2a2b26] ml-2" />
                    )}
                  </motion.div>

                  {/* טקסט "PLAY VIDEO" - מוסתר במובייל לחיסכון במקום */}
                  {!isPlaying && !isMobile && (
                    <motion.div
                      className="absolute bottom-[-80px] flex items-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        x: isPlaying ? 200 : 0 // זז ימינה עם הכפתור
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: 20,
                        x: 200 
                      }}
                      transition={{ 
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="px-6 py-3 rounded-full shadow-lg backdrop-blur-sm bg-white/90">
                        <span className="text-[#2a2b26] font-bold font-staff text-lg tracking-wider">
                          PLAY VIDEO
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* אוברליי עם גרדיאנט */}
            <div 
              className="absolute inset-0 pointer-events-none bg-black/20"
              style={{ opacity: 1 - scrollProgress * 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* תוכן נוסף */}
      <motion.div
        className="relative z-10 bg-[#fdf6ed] min-h-[90vh] sm:min-h-screen -py-16 sm:py-0 md:py-4 lg:py-16"
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