"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
  variant = 'progress',
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  variant?: 'progress' | 'volume';
}) => {
  return (
    <motion.div
      className={cn(
        variant === 'progress'
          ? "relative w-full h-[6px] sm:h-[7px] rounded-full cursor-pointer bg-[#b8a99b]/50"
          : "relative w-full h-[3px] sm:h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className={cn(
          "absolute top-0 left-0 h-full rounded-full",
          variant === 'progress'
            ? "bg-gradient-to-r from-[#9fd6cc] via-[#cfc6b8] to-[#f2a7a0]"
            : "bg-white"
        )}
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      {variant === 'progress' && (
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `calc(${value}% - 8px)` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#f2a7a0] shadow-[0_0_0_3px_rgba(255,255,255,0.4)]" />
        </div>
      )}
    </motion.div>
  );
};

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = true;
    } catch {}

    const playPromise = video.play();
    if (playPromise && typeof (playPromise as Promise<void>).then === "function") {
      playPromise
        .then(() => {
          setIsPlaying(!video.paused);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(!video.paused);
    }
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    // If video is playing but muted, first click should unmute and keep playing
    if (!video.paused && isMuted) {
      try { video.muted = false; } catch {}
      setIsMuted(false);
      setIsPlaying(true);
    } else if (video.paused) {
      // Start playing with sound
      try { video.muted = false; } catch {}
      setIsMuted(false);
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    // הסתר את הכפתור אחרי לחיצה
    setShowControls(false);
    // הצג שוב אחרי 3 שניות אם עדיין מרחפים
    setTimeout(() => {
      if (isHovering) {
        setShowControls(true);
      }
    }, 3000);
  };

const handleTimeUpdate = () => {
  if (videoRef.current) {
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isFinite(progress) ? progress : 0);
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  }
};

const handleSeek = (value: number) => {
  if (videoRef.current && videoRef.current.duration) {
    const time = (value / 100) * videoRef.current.duration;
    if (isFinite(time)) {
      videoRef.current.currentTime = time;
      setProgress(value);
    }
  }
};


return (
  <motion.div
    className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    onMouseEnter={() => {
      setIsHovering(true);
      setShowControls(true);
    }}
    onMouseLeave={() => {
      setIsHovering(false);
      setTimeout(() => {
        if (!isHovering) {
          setShowControls(false);
        }
      }, 1000);
    }}
    onTouchStart={() => {
      setIsHovering(true);
      setShowControls(true);
    }}
    onTouchEnd={() => {
      setTimeout(() => {
        setIsHovering(false);
        setShowControls(false);
      }, 3000);
    }}
  >
    <video
      ref={videoRef}
      className="w-full"
      onTimeUpdate={handleTimeUpdate}
      src={src}
      muted={isMuted}
      autoPlay
      playsInline
      preload="auto"
      onLoadedMetadata={() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise && typeof (playPromise as Promise<void>).then === "function") {
            playPromise.catch(() => {
              setIsPlaying(false);
            });
          }
        }
      }}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
    />

    {/* כפתור Play/Pause במרכז */}
    <AnimatePresence>
      {showControls && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={togglePlay}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:scale-110 transition-transform ml-1" />
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Simple timeline overlay - always visible */}
    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
      <span className="text-white text-xs sm:text-sm font-medium drop-shadow-lg">
        {formatTime(currentTime)}
      </span>
      <CustomSlider
        value={progress}
        onChange={handleSeek}
        className="flex-1"
        variant="progress"
      />
      <span className="text-white text-xs sm:text-sm font-medium drop-shadow-lg">
        {formatTime(duration)}
      </span>
    </div>
  </motion.div>
);
};

export default VideoPlayer;
