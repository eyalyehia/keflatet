'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react'; // הסרתי את Pause
import { useVideo } from '../../contexts/VideoContext';
import { useResponsive } from '../../hooks/useResponsive';

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
  const [isMuted, setIsMuted] = useState(false);
  const [isTouching, setIsTouching] = useState(false); // חדש - לניהול לחיצה במובייל
  const [isMuteButtonTouching, setIsMuteButtonTouching] = useState(false); // חדש - לניהול לחיצה על כפתור קול
  const [showAudioFeedback, setShowAudioFeedback] = useState(false); // חדש - לניהול feedback ויזואלי של האודיו

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mainVideo } = useVideo();
  const { isMobile } = useResponsive();
  
  // הוספת event listeners לוידאו
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => {
      console.log('🎬 וידאו התחיל לנגן');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('⏸️ וידאו הופסק');
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      console.log('🔚 וידאו הסתיים');
      setIsPlaying(false);
    };
    
    const handleError = (e: Event) => {
      console.error('❌ שגיאה בוידאו:', e);
    };
    
    const handleVolumeChange = () => {
      console.log('🔊 שינוי נפח:', video.muted ? 'מושתק' : 'מופעל');
      setIsMuted(video.muted);
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);
  
  // בחירה בין וידאו מוקדם לוידאו רגיל
  const shouldUsePreloaded = usePreloadedVideo && mainVideo.isReady;
  const finalVideoUrl = shouldUsePreloaded ? mainVideo.videoUrl : (videoSrc?.startsWith('/') ? videoSrc : '/Families_tell_stories/1 - כמות הדגים הייתה גדולה ובאיכות מאד טובה.mp4');
  const loading = usePreloadedVideo ? mainVideo.loading : false;
  const error = usePreloadedVideo ? mainVideo.error : null;

  // Add scroll position tracking
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      console.log('📍 SCROLL EVENT:', { currentScrollY, lastScrollY });
      
      if (!containerRef.current || !videoRef.current) {
        console.log('❌ Missing refs:', { containerRef: !!containerRef.current, videoRef: !!videoRef.current });
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      console.log('📐 Video position:', { 
        rectTop: rect.top, 
        rectBottom: rect.bottom, 
        windowHeight,
        videoMuted: videoRef.current.muted 
      });
      
      let progress = 0;
      
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        progress = Math.min(visibleHeight / (windowHeight * 0.4), 1);
      }
      
      setScrollProgress(progress);
      
      // Force mute when scrolling down past video
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        console.log('⬇️ SCROLLING DOWN DETECTED - FORCE MUTING');
        videoRef.current.muted = true;
        setIsMuted(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  // חישוב גודל הוידאו
  const baseScale = isMobile ? 0.8 : 0.3;
  const videoScale = baseScale + (scrollProgress * (1 - baseScale)); 
  const videoOpacity = 0.85 + (scrollProgress * 0.15);

  // פונקציה לשליטה בקול
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    try {
      const newMutedState = !videoRef.current.muted;
      console.log('🔊 מנסה לשנות מצב קול:', { 
        currentMuted: videoRef.current.muted, 
        newMutedState, 
        isMobile,
        isPlaying 
      });
      
      // פשוט משנים את המצב
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      console.log(newMutedState ? '🔇 אודיו מושתק' : '🔊 אודיו מופעל');
      
      // הצג feedback ויזואלי
      setShowAudioFeedback(true);
      setTimeout(() => setShowAudioFeedback(false), 2000);
      
    } catch (error) {
      console.error('שגיאה בשליטה בקול:', error);
      // במקרה של שגיאה, נחזור למצב muted
      if (videoRef.current) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  // אתחל וידאו מהתחלה ונגן
  const restartVideo = async () => {
    if (!videoRef.current) return;
    try {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
      setIsPlaying(true);
      console.log('🔁 ניגון מהתחלה');
    } catch (e) {
      console.error('❌ שגיאה בהתחלה מהתחלה:', e);
    }
  };

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
        
        // הגדרות בסיסיות לכל המכשירים
        videoRef.current.playsInline = true;
        // ודא שמתחילים מהתחלה
        try { videoRef.current.currentTime = 0; } catch {}
        
        if (isMobile) {
          // במובייל - מתחילים עם muted כדי למנוע בעיות autoplay
          videoRef.current.muted = true;
          setIsMuted(true);
          console.log('📱 במובייל - וידאו מתחיל עם אודיו מושתק');
        } else {
          // בדסקטופ - מנסים עם אודיו
          videoRef.current.muted = false;
          setIsMuted(false);
          console.log('💻 בדסקטופ - וידאו מתחיל עם אודיו');
        }
        
        // מנסים לנגן
        await videoRef.current.play();
        setIsPlaying(true);
        console.log('✅ וידאו מתנגן');
        
        // במובייל - לא מנסים להפעיל אודיו אוטומטית, המשתמש יצטרך ללחוץ על כפתור הקול
        if (isMobile) {
          console.log('📱 במובייל - המשתמש יכול להפעיל אודיו בלחיצה על כפתור הקול');
        }
      }
    } catch (error) {
      console.error('❌ שגיאה בנגינה:', error);
      
      // אם נכשל עם אודיו, מנסים עם muted
      if (!isMobile && !videoRef.current.muted) {
        try {
          console.log('🔄 מנסה עם muted...');
          videoRef.current.muted = true;
          setIsMuted(true);
          await videoRef.current.play();
          setIsPlaying(true);
          console.log('✅ עובד עם muted');
        } catch (e) {
          console.error('💥 נכשל לגמרי:', e);
        }
      }
    }
  };

  // הצגת כפתורי בקרה
  useEffect(() => {
    if (isMobile) {
      // במובייל - תמיד להראות כפתור play כשלא מתנגן
      setShowControls(!isPlaying);
    } else {
      // בדסקטופ - לוגיקה רגילה
      if (isPlaying && !isHovering) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    }
  }, [isPlaying, isHovering, isMobile]);

  // Debug logging for mobile
  useEffect(() => {
    if (isMobile) {
      console.log('📱 Mobile state - showControls:', showControls, 'isPlaying:', isPlaying);
    }
  }, [showControls, isPlaying, isMobile]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="flex relative mt-[-480px] sm:mt-[-150px] flex-col justify-center items-center px-4 py-8 min-h-screen">
        
        {/* כותרות */}
        <motion.div
          className="z-20 mb-8 text-center"
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
          className="overflow-hidden relative mx-auto rounded-2xl shadow-2xl cursor-pointer"
          style={{
            // Mobile: full-bleed width with strict 16:9 height to avoid letterboxing
            width: isMobile ? `${Math.min(100, Math.max(videoScale * 100, 92))}vw` : `${Math.min(100, Math.max(videoScale * 100, 85))}vw`,
            height: isMobile ? `${Math.max(videoScale * 56.25, 56.25)}vw` : `${Math.max(videoScale * 56.25, 40)}vw`, // keep 16:9 on desktop too
            maxWidth: isMobile ? '100vw' : '100vw',
            maxHeight: isMobile ? 'none' : 'none',
            minWidth: isMobile ? '320px' : '300px',
            minHeight: isMobile ? '180px' : '169px',
            pointerEvents: isMobile && !isPlaying ? 'none' : 'auto' // במובייל - לא מקבל אירועי לחיצה כשהכפתור מוצג
          }}
          animate={{
            scale: isMobile && isTouching && isPlaying ? videoScale * 0.95 : videoScale, // אנימציה ויזואלית במובייל רק כשמתנגן
            opacity: videoOpacity,
          }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={isMobile && !isPlaying ? undefined : togglePlay}
          onMouseEnter={() => !isMobile && setIsHovering(true)}
          onMouseLeave={() => !isMobile && setIsHovering(false)}
          onTouchStart={(e) => {
            if (isMobile && isPlaying) {
              e.preventDefault();
              setIsTouching(true);
              console.log('📱 touch start על מיכל הוידאו');
            }
          }}
          onTouchEnd={(e) => {
            if (isMobile && isPlaying) {
              e.preventDefault();
              e.stopPropagation();
              setIsTouching(false);
              console.log('📱 touch end על מיכל הוידאו');
              
              // Haptic feedback (אם הדפדפן תומך)
              if ('vibrate' in navigator) {
                navigator.vibrate(50);
              }
              
              togglePlay();
            }
          }}
          onTouchMove={(e) => {
            if (isMobile && isPlaying) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onTouchCancel={(e) => {
            if (isMobile && isPlaying) {
              e.preventDefault();
              e.stopPropagation();
              setIsTouching(false);
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
              {/* רקע למובייל */}
              {isMobile && !isPlaying && (
                <div 
                  className="flex absolute inset-0 justify-center items-center bg-center bg-cover pointer-events-none"
                  style={{
                    backgroundImage: 'url(/tumbil.png)',
                    backgroundColor: '#f5a383'
                  }}
                >
                  <div className="flex justify-center items-center w-full h-full bg-transparent pointer-events-none">
                    <div className="p-6 rounded-full shadow-2xl backdrop-blur-sm bg-white/95 pointer-events-none">
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
                preload="auto"
                controls={false}
                disablePictureInPicture
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="false"
                style={{
                  objectFit: isMobile ? 'cover' : 'contain',
                  width: '100%',
                  height: '100%',
                  objectPosition: 'center',
                  transform: 'none',
                  transformOrigin: 'center center',
                  pointerEvents: 'none' // לא מקבל אירועי לחיצה
                }}
                className={`${
                  isMobile && !isPlaying ? 'opacity-0' : 'opacity-100'
                }`}
                onVolumeChange={() => {
                  console.log('🔊 נפח השתנה:', videoRef.current?.muted ? 'מושתק' : 'מופעל');
                }}
              />
              
              {/* כפתור play במרכז */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    className="flex absolute inset-0 justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      pointerEvents: 'auto' // תמיד מקבל אירועי לחיצה
                    }}
                  >
                    <motion.button
                      className={`rounded-full shadow-2xl backdrop-blur-sm bg-white/90 cursor-pointer border-0 outline-none ${
                        isMobile ? 'p-12' : 'p-6'
                      }`}
                      tabIndex={0}
                      aria-label="נגן וידאו"
                      whileHover={{ scale: isMobile ? 1 : 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 כפתור play נלחץ (click)');
                        togglePlay();
                      }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('👆 pointer down על כפתור play');
                      }}
                      onPointerUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('👆 pointer up על כפתור play');
                        togglePlay();
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ mouse down על כפתור play');
                      }}
                      onMouseUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ mouse up על כפתור play');
                        togglePlay();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('⌨️ key down על כפתור play');
                          togglePlay();
                        }
                      }}
                      onFocus={() => {
                        console.log('🎯 כפתור play קיבל focus');
                      }}
                      onBlur={() => {
                        console.log('🎯 כפתור play איבד focus');
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ context menu על כפתור play');
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('👆 touch start על כפתור play');
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('👆 touch end על כפתור play');
                        togglePlay();
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onTouchCancel={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      style={{ 
                        pointerEvents: 'auto', // תמיד מקבל אירועי לחיצה
                        zIndex: 1000,
                        position: 'relative',
                        minWidth: isMobile ? '80px' : '60px',
                        minHeight: isMobile ? '80px' : '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Play size={isMobile ? 72 : 48} className="text-[#2a2b26] ml-2" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* כפתור התחלה מהתחלה בזמן ניגון */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.button
                    className="absolute top-3 left-3 z-50 rounded-full bg-white/90 text-[#2a2b26] px-3 py-1 text-sm shadow-md"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); restartVideo(); }}
                  >
                    התחל מהתחלה
                  </motion.button>
                )}
              </AnimatePresence>
              
              {/* כפתור קול */}
              {isPlaying && (
                <motion.div
                  className={`absolute z-30 ${
                    isMobile ? 'top-2 right-2' : 'top-4 right-4'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <motion.button
                    className={`text-white rounded-full shadow-lg backdrop-blur-sm cursor-pointer bg-black/50 border-0 outline-none ${
                      isMobile ? 'p-5' : 'p-4'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🔊 כפתור קול נלחץ (click)');
                      
                      // Haptic feedback (אם הדפדפן תומך)
                      if ('vibrate' in navigator) {
                        navigator.vibrate(30);
                      }
                      
                      toggleMute();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMuteButtonTouching(true);
                      console.log('👆 touch start על כפתור קול');
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMuteButtonTouching(false);
                      console.log('👆 touch end על כפתור קול');
                      
                      // Haptic feedback (אם הדפדפן תומך)
                      if ('vibrate' in navigator) {
                        navigator.vibrate(30);
                      }
                      
                      toggleMute();
                    }}
                    style={{
                      pointerEvents: 'auto',
                      zIndex: 1001,
                      position: 'relative',
                      transform: isMuteButtonTouching ? 'scale(0.9)' : 'scale(1)',
                      transition: 'transform 0.1s ease-out',
                      backgroundColor: isMuteButtonTouching ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {isMuted ? (
                      <VolumeX size={isMobile ? 32 : 28} />
                    ) : (
                      <Volume2 size={isMobile ? 32 : 28} />
                    )}
                  </motion.button>
                </motion.div>
              )}
              
              {/* אוברליי */}
              <div 
                className="absolute inset-0 pointer-events-none bg-transparent"
                style={{ opacity: 1 - scrollProgress * 0.5 }}
              />
              
              {/* אוברליי זמני למובייל */}
              {isMobile && isTouching && isPlaying && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none bg-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
              
              {/* Feedback ויזואלי לאודיו */}
              {showAudioFeedback && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`rounded-full p-4 shadow-lg backdrop-blur-sm ${
                    isMuted ? 'bg-red-500/80' : 'bg-green-500/80'
                  }`}>
                    {isMuted ? (
                      <VolumeX size={32} className="text-white" />
                    ) : (
                      <Volume2 size={32} className="text-white" />
                    )}
                  </div>
                </motion.div>
              )}
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