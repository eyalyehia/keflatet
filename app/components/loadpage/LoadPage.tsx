"use client";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useVideo } from '../../contexts/VideoContext';

interface LoadPageProps {
  onLoadComplete?: () => void;
  duration?: number; // משך הטעינה במילישניות
  videoPath?: string; // נתיב הוידאו לטעינה מוקדמת
}

export default function LoadPage({ onLoadComplete, duration = 2500, videoPath = 'כיף לתת 72.4mb.mp4' }: LoadPageProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [waitingForVideo, setWaitingForVideo] = useState(false);
  const [showVideoLoadingHint, setShowVideoLoadingHint] = useState(false);

  const { mainVideo, preloadVideo } = useVideo();
  const videoStatusRef = useRef({ isReady: false, loading: false });
  const videoLoadedRef = useRef(false);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoBgRef = useRef<HTMLDivElement>(null);
  const videoLoadingTextRef = useRef<HTMLDivElement>(null);

  // עדכון סטטוס הוידאו ב-ref
  useEffect(() => {
    videoStatusRef.current = { isReady: mainVideo.isReady, loading: mainVideo.loading };
  }, [mainVideo.isReady, mainVideo.loading]);

  // טעינת הוידאו (רק פעם אחת)
  useEffect(() => {
    if (!videoLoadedRef.current) {
      videoLoadedRef.current = true;
      
      // במובייל - ננסה לטעון את הוידאו
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      
      if (!isMobile) {
        console.log('🎬 מתחיל טעינת וידאו (דסקטופ)');
        preloadVideo(videoPath);
      } else {
        console.log('📱 במובייל - מנסה לטעון וידאו');
        preloadVideo(videoPath);
      }
    }
  }, [preloadVideo, videoPath]);

  // ניהול הטיימר וההתקדמות
  useEffect(() => {
    const startTime = Date.now();
    let animationFrameId: number;
    let mobileTimeoutId: number;
    let desktopTimeoutId: number;

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // חישוב התקדמות הזמן (100% מהטעינה) — רציף עד 100
      const timeProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(timeProgress);

      // סיום כשהגענו ל-100%
      const isComplete = timeProgress >= 100;
      
      if (!isComplete) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        console.log('הטעינה הסתיימה (100%) - ממתין לווידאו...');
        // לא מתחילים את אנימציית היציאה כאן - ממתינים לווידאו להיות מוכן
        // האנימציה תתחיל ב-useEffect נפרד שמאזין ל-mainVideo.isReady
      }
    };

    // במובייל - timeout נוסף למקרה שהוידאו לא נטען
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
      mobileTimeoutId = window.setTimeout(() => {
        console.log('⏰ timeout במובייל - ממשיך בלי הוידאו');
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        // כפייה לסיום הטעינה
        setProgress(100);
        console.log('ממתין שהווידאו יסמן isReady לפני הסתרת הטעינה (מובייל)');
      }, 15000); // 15 שניות timeout במובייל
    } else {
      // בדסקטופ - הוסף timeout בטיחותי כדי למנוע תקיעה
      desktopTimeoutId = window.setTimeout(() => {
        console.log('⏰ timeout בדסקטופ - ממשיך למרות שהוידאו לא מוכן');
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        setProgress(100);
        console.log('ממתין שהווידאו יסמן isReady לפני הסתרת הטעינה (דסקטופ)');
      }, 12000); // 12 שניות timeout בדסקטופ
    }

    // אנימציה ראשונית
    gsap.fromTo(preloaderRef.current, 
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(numberRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );

    gsap.fromTo(progressBarRef.current,
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.8, delay: 0.4, ease: "power2.out" }
    );

    gsap.fromTo(logoRef.current,
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1, ease: "power2.out" }
    );

    // אנימציה מתמשכת לרקע הלוגו
    gsap.fromTo(logoBgRef.current,
      { opacity: 0, scale: 0.5, rotation: 0 },
      { opacity: 1, scale: 1, rotation: 360, duration: 1, delay: 0.2, ease: "power2.out" }
    );

    // אנימציה מתמשכת לסיבוב הרקע
    gsap.to(logoBgRef.current, {
      rotation: 360,
      duration: 2.5,
      repeat: -1,
      ease: "none",
      delay: 1.2
    });

    animationFrameId = requestAnimationFrame(updateProgress);
    
    // cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mobileTimeoutId) {
        clearTimeout(mobileTimeoutId);
      }
      if (desktopTimeoutId) {
        clearTimeout(desktopTimeoutId);
      }
    };
  }, [duration, onLoadComplete]); // הסרת התלות ב-mainVideo

  // ניהול יציאה ממסך הטעינה - רק כשהטיימר הגיע ל-100% והווידאו מוכן
  useEffect(() => {
    if (progress >= 100) {
      if (mainVideo.isReady) {
        console.log('✅ טיימר הגיע ל-100% וווידאו מוכן - מתחיל אנימציית יציאה');
        
        // התחל את אנימציית העיגול והפיזור
        console.log('מתחיל אנימציית עיגול ופיזור');
        
        // הסתר את כל האלמנטים (כולל הטקסט של טעינת וידאו אם היה)
        gsap.to([numberRef.current, logoRef.current, logoBgRef.current, progressBarRef.current, videoLoadingTextRef.current], {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out"
        });

        // המתן רגע ואז צור עיגול חדש במרכז
        setTimeout(() => {
          // הראה את העיגול החדש
          gsap.set(circleRef.current, {
            width: "50px",
            height: "50px",
            left: "50%",
            top: "50%",
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            opacity: 1,
            borderRadius: "50%",
            backgroundColor: "#fdf6ed",
            position: "fixed",
            zIndex: 9999,
            display: "block"
          });

          // אנימציה 1: הראה את העיגול
          gsap.to(circleRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
              console.log('העיגול הופיע, מתחיל פיזור');
              
              // אנימציה 2: הרחב את העיגול לכל המסך
              gsap.to(circleRef.current, {
                scale: 50,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                  console.log('הפיזור הושלם');
                  
                  // אנימציה 3: היעלם
                  gsap.to(preloaderRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                      setIsVisible(false);
                      onLoadComplete?.();
                    }
                  });
                }
              });
            }
          });
        }, 300);
      } else {
        console.log('⏳ טיימר הגיע ל-100% אבל ממתין לווידאו להיות מוכן...');
        setWaitingForVideo(true);
        
        // אם עבר יותר מ-2 שניות מאז שהגענו ל-100%, הצג הודעה
        const hintTimer = setTimeout(() => {
          setShowVideoLoadingHint(true);
        }, 2000);
        
        return () => clearTimeout(hintTimer);
      }
    }
  }, [progress, mainVideo.isReady, onLoadComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-[#f5a383] flex flex-col items-center justify-center"
      suppressHydrationWarning
    >
      {/* עיגול הפיזור */}
      <div 
        ref={circleRef}
        className="fixed"
        style={{ display: 'none' }}
      />

      {/* מספר הטעינה בפינה שמאלית תחתונה */}
      <div 
        ref={numberRef}
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-[#fdf6ed] text-6xl sm:text-8xl font-bold font-staff"
        style={{ fontFamily: 'Aeonik, sans-serif' }}
      >
        {Math.round(progress).toString().padStart(3, '0')}
      </div>

      {/* ביטול טקסט "טוען וידאו..." לפי בקשת הלקוח – משאירים את ההיגיון הפנימי ללא הצגת מילים */}
      {/* לוגו מעל הסרגל עם רקע מונפש */}
      <div className="flex relative justify-center items-center mb-8 sm:mb-16">
        {/* רקע מונפש מסביב ללוגו */}
        <div 
          ref={logoBgRef}
          className="absolute w-40 h-40 bg-gradient-to-r from-white via-gray-100 to-gray-200 rounded-full opacity-30 blur-sm sm:w-56 sm:h-56"
          style={{ 
            background: 'conic-gradient(from 0deg, #ffffff, #f8fafc, #e2e8f0, #ffffff)'
          }}
        />
        <Image 
          ref={logoRef}
          src="/logo.png" 
          alt="כיף לתת" 
          width={176}
          height={176}
          className="object-contain relative z-10 w-32 h-32 sm:w-44 sm:h-44"
          priority
        />
      </div>

      {/* סרגל הטעינה העבה באמצע */}
      <div 
        ref={progressBarRef}
        className="w-64 h-3 sm:w-80 sm:h-4 md:w-96 bg-[#9acdbe] overflow-hidden shadow-2xl relative"
      >
        <div 
          ref={progressFillRef}
          className="h-full bg-[#fdf6ed] transition-all duration-300 ease-out shadow-lg absolute top-0 left-0 z-10"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 