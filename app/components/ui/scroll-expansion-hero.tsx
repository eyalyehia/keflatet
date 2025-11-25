'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import Loader from '../Loader';

// Fullscreen API types for different browsers
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenVideoElement extends HTMLVideoElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean; // kept for backward compatibility; not used in this component
  children?: ReactNode;
  // When top of media crosses this viewport height fraction, start capture (e.g., 0.7 => 70% of viewport)
  activationTopVH?: number;
  // While top of media above this viewport height fraction, keep capture (e.g., 0.85)
  retentionTopVH?: number;
  // Sticky header height compensation in pixels
  headerOffsetPx?: number;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  children,
  activationTopVH = 0.7,
  retentionTopVH = 0.85,
  headerOffsetPx = 80,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Debug: log when isFullscreen changes
  useEffect(() => {
    console.log('isFullscreen changed to:', isFullscreen);
  }, [isFullscreen]);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const preloadModalRef = useRef<HTMLVideoElement | null>(null);
  const [isModalPlaying, setIsModalPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Fullscreen handling - try native API first, fallback to modal
  const requestFs = async (): Promise<void> => {
    console.log('requestFs called!');
    const video = videoRef.current as FullscreenVideoElement;
    if (!video) {
      console.log('No video element found!');
      return;
    }
    
    // For mobile devices, always use modal fallback
    if (window.innerWidth < 768) {
      console.log('Mobile device detected, using modal fallback');
      setIsLoading(true);
      try { video.pause(); } catch {}
      console.log('Setting isFullscreen to true');
      setIsFullscreen(true);
      // Hide loader after a short delay to show the modal
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    try {
      // Try native fullscreen API first (desktop only)
      if (video.requestFullscreen) {
        await video.requestFullscreen();
        return;
      } else if (video.webkitRequestFullscreen) {
        await video.webkitRequestFullscreen();
        return;
      } else if (video.mozRequestFullScreen) {
        await video.mozRequestFullScreen();
        return;
      } else if (video.msRequestFullscreen) {
        await video.msRequestFullscreen();
        return;
      }
    } catch (error) {
      console.log('Native fullscreen failed, using modal fallback');
    }
    
    // Fallback to modal-style fullscreen
    try { video.pause(); } catch {}
    setIsFullscreen(true);
  };
  
  const exitFs = async (): Promise<void> => {
    const doc = document as FullscreenDocument;
    // Try to exit native fullscreen first
    if (document.fullscreenElement || doc.webkitFullscreenElement || 
        doc.mozFullScreenElement || doc.msFullscreenElement) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          return;
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
          return;
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
          return;
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
          return;
        }
      } catch (error) {
        console.log('Native fullscreen exit failed');
      }
    }
    
    // Fallback to modal exit
    const src = modalVideoRef.current;
    const dst = videoRef.current;
    if (src && dst) {
      try { dst.currentTime = src.currentTime || 0; } catch {}
      try { await ensureCanPlay(dst); await dst.play(); } catch {}
    }
    setIsFullscreen(false);
  };

  // Lock body scroll while dialog open and sync modal video instantly
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const run = async () => {
      if (isFullscreen) {
        body.style.overflow = 'hidden';
        const src = videoRef.current;
        const dst = modalVideoRef.current;
        if (dst) {
          try {
            if (src) dst.currentTime = src.currentTime || 0;
            dst.muted = isMuted;
            await ensureCanPlay(dst);
            await dst.play();
          } catch {}
        }
      } else {
        body.style.overflow = prevOverflow;
      }
    };
    run();
    return () => { body.style.overflow = prevOverflow; };
  }, [isFullscreen, isMuted]);

  // Preload modal video in background for instant open
  useEffect(() => {
    const v = preloadModalRef.current;
    if (!v) return;
    try { v.preload = 'auto'; v.load(); } catch {}
  }, []);

  // Start muted playback immediately once the media enters the viewport (no delay)
  useEffect(() => {
    const el = mediaRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          try {
            v.muted = true;
            v.playsInline = true;
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch {}
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Listen for fullscreen changes to sync state
  useEffect(() => {
    const doc = document as FullscreenDocument;
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !doc.webkitFullscreenElement && 
          !doc.mozFullScreenElement && !doc.msFullscreenElement) {
        // Exited fullscreen
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Wait for video to be ready to play
  const ensureCanPlay = async (v: HTMLVideoElement): Promise<void> => {
    if (v.readyState >= 2) return; // HAVE_CURRENT_DATA
    await new Promise<void>((resolve) => {
      const onCanPlay = () => {
        v.removeEventListener('canplay', onCanPlay);
        resolve();
      };
      v.addEventListener('canplay', onCanPlay, { once: true });
      // safety timeout
      setTimeout(() => {
        v.removeEventListener('canplay', onCanPlay);
        resolve();
      }, 1500);
    });
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Seek to specific time
  const seekTo = (time: number) => {
    const video = videoRef.current;
    const modalVideo = modalVideoRef.current;
    if (video) {
      video.currentTime = time;
    }
    if (modalVideo && isFullscreen) {
      modalVideo.currentTime = time;
    }
    setCurrentTime(time);
  };

  // Skip to beginning, middle, or end
  const skipTo = (position: 'start' | 'middle' | 'end') => {
    if (!duration) return;
    let targetTime = 0;
    switch (position) {
      case 'start':
        targetTime = 0;
        break;
      case 'middle':
        targetTime = duration / 2;
        break;
      case 'end':
        targetTime = duration - 5; // 5 seconds before end
        break;
    }
    seekTo(targetTime);
  };

  // Try to play with audio enabled under a user gesture
  const playWithAudio = async (v: HTMLVideoElement): Promise<boolean> => {
    try {
      // Ensure ready
      if (v.readyState === 0) {
        try { v.load(); } catch {}
      }
      await ensureCanPlay(v);
      v.muted = false;
      v.volume = 1.0;
      await v.play();
      setIsMuted(false);
      setIsPlaying(true);
      return true;
    } catch {
      // NotAllowedError or other block
      return false;
    }
  };

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
    // Try to start muted autoplay on mount
    const v = videoRef.current;
    if (v) {
      try {
        v.muted = true;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch {}
    }
  }, [mediaType]);

  useEffect(() => {
    // Media center helpers + hysteresis bands
    const getMediaCenter = () => {
      const el = mediaRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const mediaCenter = rect.top + rect.height / 2;
      return { mediaCenter, vh };
    };

    const inActivationBand = () => {
      const data = getMediaCenter();
      if (!data) return false;
      const { vh } = data;
      const el = mediaRef.current!;
      const rect = el.getBoundingClientRect();
      const headerOffset = headerOffsetPx; // px
      // Start when top of media reaches activationTopVH of viewport height (below center), with header offset
      const threshold = vh * activationTopVH + headerOffset;
      return rect.top <= threshold && rect.bottom >= vh * 0.2;
    };

    const inRetentionBand = () => {
      const data = getMediaCenter();
      if (!data) return false;
      const { vh } = data;
      const el = mediaRef.current!;
      const rect = el.getBoundingClientRect();
      const headerOffset = headerOffsetPx; // px
      // Keep capturing while media stays mostly on screen (top < retentionTopVH*vh and bottom > 10% vh)
      return rect.top <= vh * retentionTopVH + headerOffset && rect.bottom >= vh * 0.10;
    };

    const handleWheel = (e: WheelEvent) => {
      // Establish capture exactly when hitting the center zone
      let capturing = isCapturing;
      if (!capturing) {
        if (!inActivationBand()) return; // not yet in zone -> allow normal scroll
        setIsCapturing(true);
        capturing = true; // treat this event as capturing too
        // Try to ensure muted autoplay when capture starts
        const v = videoRef.current;
        if (v && v.paused) {
          try {
            v.muted = true;
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch {}
        }
      } else {
        // If left the retention zone and progress is at start, release
        if (!inRetentionBand() && scrollProgress <= 0) {
          setIsCapturing(false);
          return;
        }
      }

      if (mediaFullyExpanded) {
        if (e.deltaY < 0 && window.scrollY <= 5) {
          // collapse when scrolling up near top
          setMediaFullyExpanded(false);
          e.preventDefault();
        }
        // scrolling down when expanded -> let page scroll naturally
        return;
      }

      // Not expanded yet and capturing -> drive progress
      e.preventDefault();
      const scrollDelta = e.deltaY * 0.0009;
      const newProgress = Math.min(
        Math.max(scrollProgress + scrollDelta, 0),
        1
      );
      setScrollProgress(newProgress);

      if (newProgress >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
        setIsCapturing(false);
      } else if (newProgress < 0.75) {
        setShowContent(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      let capturing = isCapturing;
      if (!capturing) {
        if (!inActivationBand()) return;
        setIsCapturing(true);
        capturing = true;
        // Try to ensure muted autoplay when capture starts
        const v = videoRef.current;
        if (v && v.paused) {
          try {
            v.muted = true;
            const p = v.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch {}
        }
      } else {
        if (!inRetentionBand() && scrollProgress <= 0) {
          setIsCapturing(false);
          return;
        }
      }

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded) {
        if (deltaY < -20 && window.scrollY <= 5) {
          setMediaFullyExpanded(false);
          e.preventDefault();
        }
        return; // allow normal scroll otherwise
      }

      e.preventDefault();
      // Increase sensitivity for mobile, especially when scrolling back
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Higher sensitivity for scrolling back
      const scrollDelta = deltaY * scrollFactor;
      const newProgress = Math.min(
        Math.max(scrollProgress + scrollDelta, 0),
        1
      );
      setScrollProgress(newProgress);

      if (newProgress >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
        setIsCapturing(false);
      } else if (newProgress < 0.75) {
        setShowContent(false);
      }

      setTouchStartY(touchY);
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );

      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, isCapturing, activationTopVH, retentionTopVH, headerOffsetPx]);

  // Auto-mute when scrolling down past video
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Force mute when scrolling down past 100px
      if (videoRef.current && currentScrollY > 100) {
        console.log('🔇 MUTING VIDEO - scrolled down past 100px', { currentScrollY });
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);
  // Keep gradients symmetric above and below the video
  const gradientHeight = isMobileState ? '14vh' : '16vh';

  // Title overlay removed; not splitting title into words

  return (
    <>
    <div
      ref={sectionRef}
      className='overflow-x-hidden transition-colors duration-700 ease-in-out'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            {bgImageSrc.startsWith('/') ? (
              <Image
                src={bgImageSrc}
                alt='Background'
                width={1920}
                height={1080}
                className='w-screen h-screen'
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                priority
              />
            ) : (
              <div 
                className='w-screen h-screen'
                style={{
                  background: bgImageSrc.startsWith('gradient') 
                    ? bgImageSrc 
                    : `url(${bgImageSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            <div className='absolute inset-0 bg-black/10' />
          </motion.div>

          <div className='container flex relative z-10 flex-col justify-start items-center mx-auto'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              {/* Backdrop for modal-style fullscreen */}
              {isFullscreen && (
                <div className='fixed inset-0 z-[9998] bg-black/70 md:hidden' aria-hidden />
              )}
              
              {/* Fullscreen button - positioned outside the scroll container */}
              {isPlaying && !isFullscreen && (
                <>
                  {/* Mobile Fullscreen button */}
                  <button
                    type='button'
                    aria-label='מסך מלא'
                    className='md:hidden absolute bottom-12 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-lg text-white font-medium font-staff pointer-events-auto z-[9999]
                               bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                               transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
                    onClick={async (e) => { 
                      e.stopPropagation(); 
                      e.preventDefault();
                      console.log('Mobile fullscreen button clicked!');
                      await requestFs(); 
                    }}
                  >
                    מסך מלא
                  </button>
                  
                  {/* Desktop Fullscreen button */}
                  <button
                    type='button'
                    aria-label='מסך מלא'
                    className='hidden md:block absolute bottom-12 right-8 px-4 py-2 rounded-full shadow-lg text-white font-medium font-staff pointer-events-auto z-[9999]
                               bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                               transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
                    onClick={async (e) => { 
                      e.stopPropagation(); 
                      e.preventDefault();
                      await requestFs(); 
                    }}
                  >
                    מסך מלא
                  </button>
                </>
              )}
              
              {/* Loader for mobile devices */}
              {isLoading && (
                <div className='md:hidden fixed inset-0 z-[10001] bg-black/80 flex items-center justify-center'>
                  <Loader />
                </div>
              )}
              
              {/* Exit Fullscreen button - positioned outside the scroll container */}
              {isFullscreen && (
                <button
                  type='button'
                  aria-label='יציאה'
                  className='absolute top-4 right-4 px-3 py-2 rounded-full shadow-lg text-white font-medium font-staff z-[9999]
                             bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                             transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
                  onClick={async (e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
                    await exitFs(); 
                  }}
                >
                  יציאה
                </button>
              )}
              <div
                className={
                  isFullscreen
                    ? 'flex fixed inset-0 justify-center items-center p-0 rounded-2xl transition-none z-[9999] md:hidden'
                    : 'absolute top-1/2 left-1/2 z-0 rounded-2xl transition-none transform -translate-x-1/2 -translate-y-1/2'
                }
                style={
                  isFullscreen
                    ? {
                        width: '100vw',
                        height: '100dvh',
                        maxWidth: '100vw',
                        maxHeight: '100dvh',
                        boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                      }
                    : {
                        width: `${mediaWidth}px`,
                        height: `${mediaHeight}px`,
                        maxWidth: '95vw',
                        maxHeight: '92vh',
                        boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                      }
                }
                ref={mediaRef}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 rounded-xl bg-black/30'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div
                      className='overflow-visible relative w-full h-full rounded-xl pointer-events-auto'
                      style={{
                        padding: '6px',
                        background: 'linear-gradient(135deg, #98c5b1, #eb9c7d, #dac8b4)',
                        borderRadius: '0.75rem'
                      }}
                    >
                      {/* Top gradient positioned ABOVE the video box (outside) - full page width, blurred */}
                      <div
                        aria-hidden
                        className='absolute blur-lg pointer-events-none'
                        style={{
                          bottom: '100%',
                          height: gradientHeight,
                          width: '100vw',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 5,
                          background: 'linear-gradient(180deg, #98c5b1 0%, rgba(152,197,177,0) 80%)',
                        }}
                      />
                      <video
                        ref={videoRef}
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload='auto'
                        className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover lg:object-contain'} rounded-xl cursor-pointer`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const v = videoRef.current;
                          if (!v) return;
                          if (isPlaying) {
                            // Second click - pause the video
                            try { 
                              v.pause(); 
                              setIsPlaying(false);
                            } catch {}
                          } else {
                            // First click - play with audio
                            const ok = await playWithAudio(v);
                            if (!ok) {
                              // Fallback to muted playback
                              try {
                                v.muted = true;
                                setIsMuted(true);
                                await ensureCanPlay(v);
                                await v.play();
                                setIsPlaying(true);
                              } catch {}
                            }
                          }
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onTimeUpdate={(e) => {
                          if (!isDragging) {
                            setCurrentTime(e.currentTarget.currentTime);
                          }
                        }}
                        onLoadedMetadata={(e) => {
                          setDuration(e.currentTarget.duration);
                        }}
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      {/* overlay gradient */}
                      <motion.div
                        className='absolute inset-0 rounded-xl pointer-events-none bg-black/30'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                      {/* Lusion-style big text overlay when not playing - split words with center gap for button */}
                      {!isPlaying && (
                        <>
                          {/* Mobile: vertical text above and below the centered play button */}
                          <div className='flex absolute inset-0 z-40 justify-center items-center pointer-events-none md:hidden'>
                            <div className='flex flex-col gap-3 justify-center items-center'>
                              <span className='[color:#dac8b4] font-bold font-staff uppercase tracking-widest text-4xl sm:text-5xl select-none'>
                                PLAY
                              </span>
                              {/* Spacer height equal to play button to keep words around it */}
                              <div className='w-14 h-14' />
                              <span className='[color:#dac8b4] font-bold font-staff uppercase tracking-widest text-4xl sm:text-5xl select-none'>
                                REEL
                              </span>
                            </div>
                          </div>

                          {/* Desktop: keep side-by-side layout */}
                          <div className='hidden absolute inset-0 z-40 justify-center items-center pointer-events-none md:flex'>
                            <div className='flex gap-6 justify-center items-center'>
                              <span className='[color:#dac8b4] font-bold font-staff uppercase tracking-widest text-5xl md:text-7xl lg:text-8xl select-none'>
                                REEL
                              </span>
                              {/* Spacer width equal to play button to keep words on sides */}
                              <div className='w-14 h-14' />
                              <span className='[color:#dac8b4] font-bold font-staff uppercase tracking-widest text-5xl md:text-7xl lg:text-8xl select-none'>
                                PLAY
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Controls overlay */}
                      <div
                        className='flex absolute inset-0 z-50 gap-4 justify-center items-center pointer-events-none'
                      >
                        {!isPlaying && (
                          <button
                            aria-label='Play'
                            onPointerDown={(e) => { e.stopPropagation(); }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              const v = videoRef.current;
                              if (!v) return;
                              // First try with audio (user gesture)
                              const ok = await playWithAudio(v);
                              if (!ok) {
                                // Fallback to muted playback, show Unmute button for user
                                try {
                                  v.muted = true;
                                  setIsMuted(true);
                                  await ensureCanPlay(v);
                                  await v.play();
                                  setIsPlaying(true);
                                } catch {}
                              }
                            }}
                            className='w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition pointer-events-auto z-[60]
                                       bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                                       transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
                          >
                            {/* Play icon */}
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor' className='text-white'>
                              <path d='M8 5v14l11-7z' />
                            </svg>
                          </button>
                        )}




                        {isPlaying && isMuted && (
                          <button
                            aria-label='Unmute'
                            onClick={async (e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const v = videoRef.current;
                              if (!v) return;
                              try {
                                v.muted = false;
                                setIsMuted(false);
                                await ensureCanPlay(v);
                                await v.play();
                              } catch {}
                            }}
                            className='w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition pointer-events-auto z-[60]
                                       bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                                       transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
                          >
                            {/* Speaker icon */}
                            <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor' className='text-white'>
                              <path d='M3 10v4h4l5 5V5L7 10H3z'></path>
                              <path d='M16 7c1.5 1.5 1.5 8.5 0 10' fill='none' stroke='currentColor' strokeWidth='2' />
                              <path d='M19 4c3 3 3 14 0 17' fill='none' stroke='currentColor' strokeWidth='2' />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Video Progress Bar and Time Controls - positioned at bottom of video */}
                      {isPlaying && duration > 0 && (
                        <div className='absolute bottom-4 left-4 right-4 z-[70] pointer-events-auto'>
                          {/* Progress Bar */}
                          <div className='mb-3'>
                            <div 
                              className='relative w-full h-2 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer'
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const percentage = clickX / rect.width;
                                const targetTime = Math.max(0, Math.min(duration, percentage * duration));
                                seekTo(targetTime);
                              }}
                            >
                              <div 
                                className='absolute top-0 left-0 h-full bg-gradient-to-r from-[#98c5b1] to-[#eb9c7d] rounded-full transition-all duration-200 pointer-events-none'
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                              />
                              <input
                                type='range'
                                min='0'
                                max={duration}
                                value={currentTime}
                                onChange={(e) => {
                                  const time = parseFloat(e.target.value);
                                  setIsDragging(true);
                                  setCurrentTime(time);
                                }}
                                onMouseDown={() => {
                                  setIsDragging(true);
                                }}
                                onMouseUp={(e) => {
                                  const time = parseFloat(e.currentTarget.value);
                                  seekTo(time);
                                  setIsDragging(false);
                                }}
                                onTouchStart={() => {
                                  setIsDragging(true);
                                }}
                                onTouchEnd={(e) => {
                                  const time = parseFloat(e.currentTarget.value);
                                  seekTo(time);
                                  setIsDragging(false);
                                }}
                                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                style={{ zIndex: 10 }}
                              />
                            </div>
                          </div>
                          
                          {/* Time Display */}
                          <div className='flex items-center justify-center text-white text-sm font-staff'>
                            <span className='bg-black/50 px-2 py-1 rounded backdrop-blur-sm'>
                              {formatTime(duration)} / {formatTime(currentTime)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Bottom gradient positioned BELOW the video box (outside) - full page width, blurred */}
                      <div
                        aria-hidden
                        className='absolute blur-lg pointer-events-none'
                        style={{
                          top: '100%',
                          height: gradientHeight,
                          width: '100vw',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 5,
                          background: 'linear-gradient(0deg, #eb9c7d 0%, rgba(235,156,125,0) 80%)',
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='object-cover w-full h-full rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 rounded-xl bg-black/50'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                {(date || scrollToExpand) && (
                  <div className='flex relative z-10 flex-col items-center mt-4 text-center transition-none pointer-events-none'>
                    {date && (
                      <p
                        className='text-2xl text-blue-200'
                        style={{ transform: `translateX(-${textTranslateX}vw)` }}
                      >
                        {date}
                      </p>
                    )}
                    {scrollToExpand && (
                      <p
                        className='font-medium font-staff text-center text-blue-200'
                        style={{ transform: `translateX(${textTranslateX}vw)` }}
                      >
                        {scrollToExpand}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Title overlay removed per request */}
            </div>

            <motion.section
              className='flex flex-col px-8 py-10 w-full md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>

    {isFullscreen && createPortal(
      <div className='fixed inset-0 z-[10000] flex items-center justify-center bg-black/80'>
        <div className='relative w-[100vw] h-[100dvh]'>
          <video
            ref={modalVideoRef}
            src={mediaSrc}
            poster={posterSrc}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload='auto'
            className='object-contain w-full h-full bg-black'
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            onPlay={() => setIsModalPlaying(true)}
            onPause={() => setIsModalPlaying(false)}
            onTimeUpdate={(e) => {
              if (!isDragging) {
                setCurrentTime(e.currentTarget.currentTime);
              }
            }}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
            }}
          />
          <button
            type='button'
            aria-label='יציאה'
            className='absolute top-4 right-4 px-3 py-2 rounded-full shadow-lg text-white font-medium font-staff
                       bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                       transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
            onClick={async (e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              await exitFs(); 
            }}
          >
            יציאה
          </button>

          {/* Controls inside the dialog */}
          <div className='flex absolute bottom-6 left-1/2 gap-3 items-center -translate-x-1/2'>
            <button
              type='button'
              aria-label='נגן'
              className='px-4 py-2 rounded-full shadow-lg text-white font-medium font-staff
                         bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                         transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const v = modalVideoRef.current;
                if (!v) return;
                try { await ensureCanPlay(v); await v.play(); } catch {}
              }}
            >
              {isModalPlaying ? 'מנגן' : 'נגן'}
            </button>

            <button
              type='button'
              aria-label='עצור'
              className='px-4 py-2 rounded-full shadow-lg text-white font-medium font-staff
                         bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                         transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const v = modalVideoRef.current;
                if (!v) return;
                try { v.pause(); setIsModalPlaying(false); } catch {}
              }}
            >
              עצור
            </button>
          </div>

          {/* Exit to site button inside dialog */}
          <button
            type='button'
            aria-label='יציאה לאתר'
            className='absolute bottom-6 right-4 px-4 py-2 rounded-full shadow-lg text-white font-medium font-staff
                       bg-[#eb9c7d] hover:bg-[#98c5b1] active:bg-[#98c5b1] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent 
                       transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95'
            onClick={async (e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              await exitFs(); 
            }}
          >
            יציאה לאתר
          </button>
        </div>
      </div>, document.body)}
    </>
  );
};

export default ScrollExpandMedia;