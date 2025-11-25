"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Reveal from "../components/Reveal";
import Lottie from "lottie-react";

import TestimonialCard from "../components/ui/testimonial-card";
import TestimonialVideo from "../components/ui/testimonial-video";
import { TestimonialVideoProvider, useTestimonialVideo } from "../contexts/TestimonialVideoContext";

const testimonials = [
  {
    text: "כמות הדגים הייתה גדולה ובאיכות מאד טובה",
    name: "משפחה א'",
    audioPath: "/Families_tell_stories/1 - כמות הדגים הייתה גדולה ובאיכות מאד טובה.mp4"
  },
  {
    text: "תודה רבה על כל רגע שאתם חושבים ומתכננים איך לתת לנו",
    name: "משפחה ב'",
    audioPath: "/Families_tell_stories/2 - תודה רבה על כל רגע שאתם חושבים ומתכננים איך לתת לנו.mp4"
  },
  {
    text: "זה הציל אותנו ממש בישלנו עם זה את החג",
    name: "משפחה ג'",
    audioPath: "/Families_tell_stories/3 - זה הציל אותנו ממש בישלנו עם זה את החג .mp4"
  },
  {
    text: "זה מאד עזר!",
    name: "משפחה ד'",
    audioPath: "/Families_tell_stories/4 - זה מאד עזר!.mp4"
  },
  {
    text: "זה עשה לנו ממש שמחה גדולה",
    name: "משפחה ה'",
    audioPath: "/Families_tell_stories/5 - זה עשה לנו ממש שמחה גדולה.mp4"
  },
  {
    text: "זה ממש הצלת נפשות",
    name: "משפחה ו'",
    audioPath: "/Families_tell_stories/6 - זה ממש הצלת נפשות.mp4"
  },
  {
    text: "בזכות זה יכלנו להכניס אורחים בפורים",
    name: "משפחה ז'",
    audioPath: "/Families_tell_stories/7 - בזכות זה יכלנו להכניס אורחים בפורים.mp4"
  }
];

function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<'prev' | 'next' | null>(null);
  const [isNavigating, setIsNavigating] = useState(false); // מניעת לחיצות כפולות
  const { stopAllVideos, setCurrentPlayingFamilyAudio, currentPlayingFamilyAudio, stopFamilyAudio } = useTestimonialVideo();

  // פונקציה לטיפול בהשמעת אודיו (בבלעדיות מול וידאו)
  const handleAudioPlay = (audioPath: string) => {
    const audio = document.getElementById(audioPath) as HTMLAudioElement | null;
    if (!audio) return;

    if (currentPlayingFamilyAudio === audioPath) {
      // אם לוחצים שוב על אותו אודיו – עצירה
      audio.pause();
      audio.currentTime = 0;
      setCurrentPlayingFamilyAudio(null);
      setAnimationsPaused(false);
      return;
    }

    // מתחילים אודיו חדש: עצור כל הסרטונים שרצים
    stopAllVideos();

    // עצור אודיו קודם אם יש
    if (currentPlayingFamilyAudio) {
      const prev = document.getElementById(currentPlayingFamilyAudio) as HTMLAudioElement | null;
      if (prev) {
        prev.pause();
        prev.currentTime = 0;
      }
    }

    // נגן אודיו חדש
    audio.play();
    setCurrentPlayingFamilyAudio(audioPath);
    setAnimationsPaused(true);

    audio.onended = () => {
      setCurrentPlayingFamilyAudio(null);
      setAnimationsPaused(false);
    };
  };

  // פונקציות לניווט בקרוסלה
  const nextTestimonial = () => {
    if (isNavigating) return; // מניעת לחיצות כפולות
    
    setIsNavigating(true);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setButtonPressed('next');
    
    setTimeout(() => {
      setButtonPressed(null);
      setIsNavigating(false);
    }, 300); // חזור למצב רגיל אחרי 300ms
  };

  const prevTestimonial = () => {
    if (isNavigating) return; // מניעת לחיצות כפולות
    
    setIsNavigating(true);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setButtonPressed('prev');
    
    setTimeout(() => {
      setButtonPressed(null);
      setIsNavigating(false);
    }, 300); // חזור למצב רגיל אחרי 300ms
  };

  // מעבר אוטומטי כל 5 שניות (אופציונלי)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentPlayingFamilyAudio && !isNavigating) { // רק אם לא משמיעים אודיו ולא מנווטים ידנית
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPlayingFamilyAudio, isNavigating]);

  // event listener לגלילה - חזור לאנימציות
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 50 && animationsPaused) {
        setAnimationsPaused(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationsPaused]);

  return (
      <section id="משפחות-מספרות" className="relative min-h-screen bg-gradient-to-br from-[#fdf6ed] via-[#fdf6ed] to-[#f5f0e8] py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto">
            <div className="flex items-center justify-center gap-3 mb-1 sm:mb-2">
              <Reveal as="h2" type="heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center text-[#2a2b26] font-staff">
                סיפורי משפחות מרגשים
              </Reveal>
              <Reveal type="media" className="inline-flex">
                <Image 
                  src="/hibuk.png" 
                  alt="חיבוק" 
                  width={64}
                  height={64}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 object-contain"
                />
              </Reveal>
            </div>
            <div>
              <Reveal as="p" type="paragraph" className="text-center mt-1 sm:mt-2 md:mt-3 opacity-75 text-lg sm:text-xl md:text-2xl text-[#2a2b26] font-staff">
                שמעו מה משפחות אומרות על הפעילות שלנו -
                <span className="block">כל עדות מלווה בהקלטה אמיתית</span>
              </Reveal>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-6 md:mt-8 text-[#f5a383]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <span className="text-sm font-staff">לחצו על הסמל כדי לשמוע</span>
            </div>
          </div>

          {/* מרווח נוסף בין ההוראה לעדויות */}
          <div className="mt-8 md:mt-12"></div>

          {/* תצוגה אחידה למובייל ודסקטופ - קרוסלה */}
          <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg">
            <AnimatePresence mode="wait">
              <TestimonialCard 
                key={currentTestimonial}
                testimonial={testimonials[currentTestimonial]}
                onAudioPlay={handleAudioPlay}
                playingAudio={currentPlayingFamilyAudio}
              />
            </AnimatePresence>
            
            {/* כפתורי ניווט */}
            <div className="flex gap-4 justify-center mt-2 sm:mt-4 md:mt-6">
              <button 
                onClick={nextTestimonial}
                disabled={isNavigating}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
                  buttonPressed === 'next' 
                    ? 'bg-[#9acdbe] text-white' 
                    : 'bg-white text-[#f5a383] hover:bg-[#98c5b1] hover:text-white'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
              <button 
                onClick={prevTestimonial}
                disabled={isNavigating}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
                  buttonPressed === 'prev' 
                    ? 'bg-[#9acdbe] text-white' 
                    : 'bg-white text-[#f5a383] hover:bg-[#98c5b1] hover:text-white'
                } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* סרטונים נוספים */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <Reveal as="h3" type="heading" className="text-2xl sm:text-3xl font-bold text-[#2a2b26] font-staff mb-2">
              סרטונים נוספים
            </Reveal>
          </div>
          
          <Reveal type="media" className="grid grid-cols-2 gap-3 max-[467px]:grid-cols-1 max-[467px]:gap-4 sm:gap-6 md:gap-8 max-w-2xl md:max-w-4xl mx-auto px-4">
            <TestimonialVideo 
              videoPath="סרטון1.mp4"
              className="w-full"
              videoId="testimonial-video-1"
              thumbnailSrc="/pictures/women.webp"
            />
            <TestimonialVideo 
              videoPath="סרטון2.mp4"
              className="w-full"
              videoId="testimonial-video-2"
              thumbnailSrc="/pictures/men.webp"
              // women.webp
            />
          </Reveal>
        </div>
        
        {/* רקע דקורטיבי */}
        <div className="overflow-hidden absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#f5a383]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#9acdbe]/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#f5a383]/5 rounded-full blur-lg"></div>
        </div>
      </section>
  );
};

const FamiliesTestimonials = () => {
  return (
    <TestimonialVideoProvider>
      <TestimonialsSection />
    </TestimonialVideoProvider>
  );
};

export default FamiliesTestimonials;