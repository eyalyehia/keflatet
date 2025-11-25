"use client";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface AudioContextType {
  isSoundOn: boolean;
  toggleSound: () => void;
  isAudioReady: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize audio only once globally
  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return;
    
    // Check if audio already exists globally
    if (!audioRef.current) {
      const audio = new Audio('/עקיבא - שלום בבית (Prod (mp3cut.net).mp3');
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 1;
      audioRef.current = audio;
      
      // Mark as initialized to prevent multiple instances
      isInitializedRef.current = true;
      setIsAudioReady(true);
    }

    const audio = audioRef.current!;

    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsSoundOn(true);
        removeFirstInteractionListeners();
      } catch (_) {
        // Autoplay blocked: wait for first user interaction
        setIsSoundOn(false);
        addFirstInteractionListeners();
      }
    };

    const onFirstInteraction = async () => {
      try {
        await audio.play();
        setIsSoundOn(true);
      } catch (_) {
        setIsSoundOn(false);
      }
      removeFirstInteractionListeners();
    };

    const addFirstInteractionListeners = () => {
      const opts: AddEventListenerOptions = { once: true, capture: true };
      window.addEventListener('pointerdown', onFirstInteraction as EventListener, opts);
      window.addEventListener('click', onFirstInteraction as EventListener, opts);
      window.addEventListener('keydown', onFirstInteraction as EventListener, opts);
      window.addEventListener('wheel', onFirstInteraction as EventListener, opts);
      window.addEventListener('touchstart', onFirstInteraction as EventListener, opts);
    };

    const removeFirstInteractionListeners = () => {
      const opts: EventListenerOptions = { capture: true };
      window.removeEventListener('pointerdown', onFirstInteraction as EventListener, opts);
      window.removeEventListener('click', onFirstInteraction as EventListener, opts);
      window.removeEventListener('keydown', onFirstInteraction as EventListener, opts);
      window.removeEventListener('wheel', onFirstInteraction as EventListener, opts);
      window.removeEventListener('touchstart', onFirstInteraction as EventListener, opts);
    };

    // Try autoplay only once
    tryAutoPlay();

    return () => {
      removeFirstInteractionListeners();
    };
  }, []);

  // Handle play/pause when toggle changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady) return;

    if (isSoundOn) {
      audio.play().catch(() => {
        setIsSoundOn(false);
      });
    } else {
      audio.pause();
    }
  }, [isSoundOn, isAudioReady]);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  return (
    <AudioContext.Provider value={{ isSoundOn, toggleSound, isAudioReady }}>
      {children}
    </AudioContext.Provider>
  );
};
