'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface TestimonialVideoContextType {
  currentPlayingVideo: string | null;
  setCurrentPlayingVideo: (videoId: string | null) => void;
  stopAllVideos: () => void;
  currentPlayingFamilyAudio: string | null;
  setCurrentPlayingFamilyAudio: (audioPath: string | null) => void;
  stopFamilyAudio: () => void;
}

const TestimonialVideoContext = createContext<TestimonialVideoContextType | undefined>(undefined);

export const useTestimonialVideo = () => {
  const context = useContext(TestimonialVideoContext);
  if (!context) {
    throw new Error('useTestimonialVideo must be used within a TestimonialVideoProvider');
  }
  return context;
};

interface TestimonialVideoProviderProps {
  children: React.ReactNode;
}

export const TestimonialVideoProvider = ({ children }: TestimonialVideoProviderProps) => {
  const [currentPlayingVideo, setCurrentPlayingVideoState] = useState<string | null>(null);
  const [currentPlayingFamilyAudio, setCurrentPlayingFamilyAudioState] = useState<string | null>(null);

  const setCurrentPlayingVideo = useCallback((videoId: string | null) => {
    console.log('🎬 שינוי וידאו נוכחי:', videoId);
    setCurrentPlayingVideoState(videoId);
    
    // אם וידאו מתחיל לנגן, עצור את אודיו המשפחות
    if (videoId && currentPlayingFamilyAudio) {
      stopFamilyAudio();
    }
  }, [currentPlayingFamilyAudio]);

  const setCurrentPlayingFamilyAudio = useCallback((audioPath: string | null) => {
    console.log('🔊 שינוי אודיו משפחות נוכחי:', audioPath);
    setCurrentPlayingFamilyAudioState(audioPath);
  }, []);

  const stopAllVideos = useCallback(() => {
    console.log('⏹️ עצירת כל הסרטונים');
    setCurrentPlayingVideoState(null);
    // שדר אירוע גלובלי כדי שנוכל למנוע auto-resume בצד הווידאו
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('testimonial:forceStop'));
      } catch {}
    }
    
    // עצירת כל הסרטונים בדף
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  const stopFamilyAudio = useCallback(() => {
    console.log('🔇 עצירת אודיו משפחות');
    if (currentPlayingFamilyAudio) {
      const audio = document.getElementById(currentPlayingFamilyAudio) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setCurrentPlayingFamilyAudioState(null);
    }
  }, [currentPlayingFamilyAudio]);

  return (
    <TestimonialVideoContext.Provider value={{
      currentPlayingVideo,
      setCurrentPlayingVideo,
      stopAllVideos,
      currentPlayingFamilyAudio,
      setCurrentPlayingFamilyAudio,
      stopFamilyAudio
    }}>
      {children}
    </TestimonialVideoContext.Provider>
  );
};
