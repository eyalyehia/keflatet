
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplashCursor } from './components';
import NavigationBar from './pages/Navbar';
import HeroSection from './pages/HeroSection';
import LoadPage from './components/loadpage/LoadPage';
import Footer from './pages/Footer';
import Script from 'next/script';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTextAnimation, setShowTextAnimation] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // סימון שהקומפוננטה רצה בצד הקליינט בלבד (אחרי Hydration)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // קביעת מצב ראשוני בצד לקוח בלבד כדי למנוע Hydration mismatch בערכי isLoading/showTextAnimation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const shown = window.sessionStorage.getItem('splashShown');
      // במסך הראשון תמיד מציגים את מסך הטעינה, גם אם נכנסנו עם hash לקטע בעמוד
      // רק אם כבר ראינו את מסך הטעינה (splashShown), נדלג עליו בביקורים הבאים
      setIsLoading(!shown);
      // אם כבר ראינו את מסך הטעינה, הראה את האנימציה מיד
      setShowTextAnimation(!!shown);
    } catch {
      // במקרה של שגיאה נשאיר את ברירת המחדל (isLoading=true, showTextAnimation=false)
    }
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
    try { window.sessionStorage.setItem('splashShown', '1'); } catch {}
    
    // אפקט GSAP רק לתוכן הראשי (ללא אפקט על הניווט)

    gsap.fromTo(mainContentRef.current,
      { y: 50 },
      { y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    // התחל את אפקט הכתיבה אחרי שהאנימציה מסתיימת
    setTimeout(() => {
      setShowTextAnimation(true);
    }, 1500);
  };

  // אם יש hash בכתובת, גלול אליו לאחר שהמסך הראשי מוצג
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = window.setTimeout(() => {
      if (!isLoading && window.location.hash) {
        const id = window.location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
        }
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return (
    <div suppressHydrationWarning>
      {/* Eruda devtools: mobile-only (enabled in all environments) - COMMENTED OUT */}
      {/* <Script id="eruda-loader" strategy="afterInteractive">
        {`
          try {
            if (typeof window !== 'undefined') {
              var ua = navigator.userAgent || '';
              var isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
              if (isMobile) {
                var s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/eruda';
                s.onload = function () { try { eruda.init(); } catch (e) { console.warn('Eruda init failed', e); } };
                document.body.appendChild(s);
              }
            }
          } catch (e) { console.warn('Eruda load failed', e); }
        `}
      </Script> */}
      {/* SplashCursor פעיל תמיד */}
      <SplashCursor />

      {/* כדי למנוע Hydration mismatch: בזמן SSR וב-render הראשון בלקוח isHydrated=false ולכן לא מוצג לא מסך טעינה ולא Navbar */}
      {isHydrated && isLoading && (
        <LoadPage
          onLoadComplete={handleLoadComplete}
          duration={2500}
          videoPath="כיף לתת 72.4mb.mp4"
        />
      )}
      {isHydrated && !isLoading && <NavigationBar />}

      <main ref={mainContentRef}>
      {/* className="pt-32" */}
        <HeroSection showTextAnimation={showTextAnimation} />
      </main>
      <Footer />
    </div>
  );
}
