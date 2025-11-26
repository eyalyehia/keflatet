import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { HorizontalScrollCarousel } from '../components';
import VideoPlayer from '@/components/ui/video-player';
import VideoLoader from '@/components/ui/VideoLoader';
import FamiliesTestimonials from './Testimonials';
import { useVideo } from '../contexts/VideoContext';
import { PulseBeamsFirstDemo } from '../components/call to action/demo';
import DonationSectionFrame from './DonationSectionFrame';
import OrganizationPurpose from './organization-purpose';
import OrganizationStory from './Organization-story';
import Reveal from '../components/Reveal';
import { motion } from 'framer-motion';
import { CardStack3D } from '@/components/ui/3d-flip-card';
import { ImageDialog } from '../components/ui/image-dialog';

// Declare the custom element so TSX recognizes <lottie-player />
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        background?: string;
        speed?: string | number;
        loop?: boolean;
        autoplay?: boolean;
        style?: React.CSSProperties;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

interface HeroSectionProps {
  showTextAnimation: boolean;
}

const HeroSection = ({ showTextAnimation }: HeroSectionProps) => {
  // קבלת הוידאו מהקונטקסט (הוא נטען מראש בLoadPage)
  const { mainVideo, preloadVideo } = useVideo();
  const { loading, error, isReady } = mainVideo;
  
  // זיהוי גודל המסך
  const [isMobile, setIsMobile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // בדיקה ראשונית
    checkScreenSize();
    
    // האזנה לשינויים בגודל המסך
    window.addEventListener('resize', checkScreenSize);
    
    // ניקוי
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // הסרנו את טעינת הגיבוי - הסרטון נטען רק ב-LoadPage
  // כך מובטח שהמשתמש לא יראה סרטון נטען או עומד
  // אם המשתמש מרענן, הוא יראה שוב את מסך הטעינה שיטען את הסרטון
  
  // Only show the futuristic hero when text animation should be visible
  if (!showTextAnimation) {
    return (
      <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-[#fdf6ed] sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mb-8">
            <div className="flex justify-center w-[200px] sm:w-[250px] md:w-[300px] transition-all duration-300">
              <Image
                src="/title.png"
                alt="כיף לתת - עם כל נתינה הלב מתמלא"
                width={500}
                height={200}
                style={{ 
                  width: '100%',
                  height: 'auto'
                }}
                className="object-fill"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* טקסט ולוגו מקוריים */}
      <div className="relative  w-full bg-[#fdf6ed] pt-48" style={{ overflow: 'visible' }}>
        {/* גובה המסך הוא h-screen */}
        {/* Subtle animated background grid */}
        <div className="absolute inset-0 opacity-20 z-5">
          <div className="w-full h-full cyber-grid"></div>
        </div>

        {/* Scanning line effect */}
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#f5a383] to-transparent opacity-40 z-10"
          style={{
            animation: 'scanline 4s linear infinite',
          }}
        />

        {/* Text Content */}
        <div className="flex relative z-20 flex-col justify-center items-center px-10 text-center min-h-[55vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[65vh]" style={{ overflow: 'visible', paddingBottom: '24px' }}>
          <div 
            className="opacity-100 transition-all transform -translate-y-[60px] sm:-translate-y-[30px] md:-translate-y-[60px] duration-2000"
          >
            {/* Content Wrapper - עטיפה חדשה */}
            <div className="flex flex-col items-center">
              {/* Logo Image - מיקום וגודל התמונה */}
              {/* זוהי המעטפת של הלבבות */}
              <div
                className="flex relative justify-center items-center mx-auto -mt-16 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 hero-image-container"
                style={{
                  zIndex: 10,
                  overflow: 'visible',
                  marginTop: '-24px'
                }}
              >
                {/* זו האנימציה של הלבבות - כאן תוכל להתאים את המסלול */}
                {/* מתחיל מתחת לכותרת והכפתור כך שהאנימציה נראית יותר טוב */}
                <motion.div
                  initial={{ scale: 1, y: 200 }}
                  animate={isMobile ? {
                    // מסלול התנועה של הלבבות למסכים קטנים:
                    // נקודה 1: (0,0) - מרכז התחלה
                    // נקודה 2: (100,100) - ימינה למעלה (קטן יותר)
                    // נקודה 3: (150,0) - ימינה (קטן יותר)
                    // נקודה 4: (100,-150) - ימינה למעלה (קטן יותר)
                    // נקודה 5: (0,-200) - מרכז למעלה (הנקודה הגבוהה ביותר - קטן יותר)
                    // נקודה 6: (-100,-100) - שמאלה למעלה (קטן יותר)
                    // נקודה 7: (-150,0) - שמאלה (קטן יותר)
                    // נקודה 8: (-100,50) - שמאלה למטה (קטן יותר)
                    // נקודה 9: (0,50) - חזרה למרכז (קצת למטה - קטן יותר)
                    x: [0, 100, 100, -220, -220, 0, 0, 0, 0],
                    y: [0, 0, 300, 300, 0, 0, 0, 0, 85],
                    rotate: -360, // סיבוב מלא נגד כיוון השעון
                    scale: [1.5, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.4, 1.5] // שינוי גודל קטן יותר
                  } : {
                    // מסלול התנועה של הלבבות למסכים גדולים:
                    // נקודה 1: (0,0) - מרכז התחלה
                    // נקודה 2: (50,50) - ימינה למעלה
                    // נקודה 3: (200,0) - ימינה
                    // נקודה 4: (150,-200) - ימינה למעלה
                    // נקודה 5: (0,-300) - מרכז למעלה (הנקודה הגבוהה ביותר)
                    // נקודה 6: (-150,-150) - שמאלה למעלה
                    // נקודה 7: (-200,0) - שמאלה
                    // נקודה 8: (-150,100) - שמאלה למטה
                    // נקודה 9: (0,85) - חזרה למרכז (קצת למטה)
                    x: [0, 250, 250, -500, -500, 0, 0, 0, 0],
                    y: [0, 0, 500, 500, 0, 0, 0, 0, 85],
                    rotate: -360, // סיבוב מלא נגד כיוון השעון
                    scale: [1.5, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2, 1.5] // שינוי גודל
                  }}
                  transition={{ 
                    duration: 6, 
                    ease: "easeInOut", 
                    times: [
                      0,      // נקודה 1: התחלה (0%)
                      0.02,  // נקודה 2: ימינה למעלה (12.5%)
                      0.15,   // נקודה 3: ימינה (25%)
                      0.375,  // נקודה 4: ימינה למעלה (37.5%)
                      0.5,    // נקודה 5: מרכז למעלה (50%)
                      0.625,  // נקודה 6: שמאלה למעלה (62.5%)
                      0.75,   // נקודה 7: שמאלה (75%)
                      0.875,  // נקודה 8: שמאלה למטה (87.5%)
                      1       // נקודה 9: חזרה למרכז (100%)
                    ]
                  }}
                  className="absolute z-50"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(245, 163, 131, 0.9))',
                    willChange: 'transform', 
                    position: 'absolute',
                    top: '0px',
                    left: 0,
                    right: 0,
                    margin: '0 auto',
                    pointerEvents: 'none',
                    transform: 'translateY(0)'
                  }}
                >
                  <Image
                    src="/noBg.png"
                    alt="Logo"
                    width={320}
                    height={320}
                    className="object-contain w-full h-full transition-all duration-500 ease-in-out cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(42, 43, 38, 0.3))',
                    }}
                    priority
                  />
                </motion.div>
              </div>

              {/* Title Image - תמונת הכותרת */}
              <div className="flex relative z-20 justify-center items-center -mt-4 sm:-mt-4 md:-mt-4 lg:-mt-6 w-[160px] sm:w-[250px] md:w-[300px] transition-all duration-300">
                <Image
                  src="/title.png"
                  alt="כיף לתת - עם כל נתינה הלב מתמלא"
                  width={300}
                  height={100}
                  className="object-contain transition-all duration-500 ease-in-out cursor-pointer hover:scale-105 hover:rotate-1 active:scale-95"
                  style={{
                    animation: 'glitch 3s ease-in-out infinite alternate',
                    animationDelay: '0.5s'
                  }}
                  priority
                />
              </div>

            </div>
          </div>



          {/* Corner decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 w-6 h-6 border-l-2 border-t-2 border-[#f5a383]/60"></div>
            <div className="absolute top-6 right-6 w-6 h-6 border-r-2 border-t-2 border-[#9acdbe]/60"></div>
            <div className="absolute bottom-20 left-6 w-6 h-6 border-l-2 border-b-2 border-[#f5a383]/60"></div>
            <div className="absolute bottom-20 right-6 w-6 h-6 border-r-2 border-b-2 border-[#9acdbe]/60"></div>
          </div>
        </div>
      </div>

      {/* הודעת שגיאה לוידאו */}
      {error && (
        <div className="flex justify-center items-center py-1 sm:py-2 md:py-4 lg:py-6 bg-[#fdf6ed]">
          <Reveal as="p" type="paragraph" className="text-lg text-center text-red-600 sm:text-xl font-staff">
            {error}
          </Reveal>
        </div>
      )}
      
      <div className="bg-[#fdf6ed] py-8 sm:py-10 md:py-12 lg:py-16">
        <div id="הפעילות-שלנו" className="px-4 mx-auto max-w-3xl text-center sm:px-6 md:px-8">
            {/* תמונה עם אנימציה */}
            <div className="flex justify-center mb-2 sm:mb-3" style={{ marginBottom: '-35px' }}>
              <div className="relative group">
                {/* רקע זוהר */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5a383] to-[#9acdbe] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
                
                {/* מיכל התמונה עם אנימציה */}
                <Reveal type="media" as="div" className="relative transition-all duration-700 transform hover:scale-110 hover:rotate-3 active:scale-95"
                     style={{
                       animation: 'coinGlow 4s ease-in-out infinite',
                     }}>
                  <Image
                    src="/Hand with coin.png"
                    alt="יד עם מטבע - סמל הנתינה"
                    width={300}
                    height={300}
                    className="object-contain w-32 h-32 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
                    style={{
                      animation: 'coinFloat 4s ease-in-out infinite',
                    }}
                  />
                  
                  {/* אפקט זוהר מסביב */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f5a383]/20 to-[#9acdbe]/20 blur-md animate-ping"></div>
                
                  {/* חלקיקים זוהרים */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#f5a383] rounded-full opacity-60 animate-ping" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute -top-4 -right-4 w-3 h-3 bg-[#9acdbe] rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-[#f5a383] rounded-full opacity-60 animate-ping" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-[#9acdbe] rounded-full opacity-60 animate-ping" style={{ animationDelay: '3s' }}></div>
                </Reveal>
              </div>
            </div>

            <Reveal as="h2" type="heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center text-[#2a2b26] font-staff mb-2 sm:mb-3">
              עמותת כיף לתת
            </Reveal>
            <Reveal as="p" type="paragraph" className="text-base sm:text-lg md:text-xl mb-2 sm:mb-2 text-[#2a2b26] font-staff leading-loose">
              מעניקה בשר, עופות, דגים ביצים ויין למאות משפחות באופן קבוע.
            </Reveal>
            <Reveal as="p" type="paragraph" className="text-base sm:text-lg md:text-xl mb-2 sm:mb-2 text-[#2a2b26] font-staff leading-loose">
              בנוסף, כיף לתת עוזרת לילדים עם מוגבלויות ומשמחת ילדים בבתי חולים.
            </Reveal>
            <Reveal as="p" type="paragraph" className="text-base sm:text-lg md:text-xl mb-2 sm:mb-2 text-[#2a2b26] font-staff leading-loose">
              הפעילות שלנו מבוצעת מתוך אמונה עמוקה בעקרונות של נתינה,<br />אהבת הזולת ורצון לשמח את האחר.
            </Reveal>
            <Reveal as="p" type="paragraph" className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-2 text-[#2a2b26] font-staff leading-relaxed font-semibold">
              כל פעילות העמותה נעשית על ידי מתנדבים וללא מקבלי שכר.
            </Reveal>

            {/* Lottie animations row */}
            <div className="flex flex-row gap-4 justify-center items-center mt-2 sm:mt-3 sm:gap-6 md:gap-10 lg:gap-12">
              {/* Load Lottie web component once on client */}
              <Script
                src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
                strategy="afterInteractive"
              />

              <Reveal type="media" as="div" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                <lottie-player
                  src="/animation-json/handshake%20blue.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  className="w-full h-full"
                  style={{ width: 'auto', height: 'auto' }}
                ></lottie-player>
              </Reveal>

              <Reveal type="media" as="div" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                <lottie-player
                  src="/animation-json/Donation.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  className="w-full h-full"
                  style={{ width: 'auto', height: 'auto' }}
                ></lottie-player>
              </Reveal>

              <Reveal type="media" as="div" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                <lottie-player
                  src="/animation-json/Heart.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  className="w-full h-full"
                  style={{ width: 'auto', height: 'auto' }}
                ></lottie-player>
              </Reveal>
            </div>
          </div>
        </div>
      
      {/* הוידאו מתחת לטקסט – יוצג רק כשהוידאו מוכן, כדי שלא תופיע מסגרת ריקה או טעינה קצרה */}
      {!error && mainVideo.isReady && (
        <div className="bg-[#fdf6ed] px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          <VideoPlayer src={mainVideo.videoUrl} />
        </div>
      )}

      {/* גלריה של תמונות פעילות העמותה */}
      <div id="תמונות-ווידאו" className="bg-[#fdf6ed] py-6 sm:py-8 md:py-12 lg:py-16 text-center">
        <Reveal as="h2" type="heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center text-[#2a2b26] font-staff mb-6 sm:mb-8 md:mb-10 flex items-center justify-center gap-3">
          תמונות מפעילות העמותה
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 1024 1024" 
            className="sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
            fill="currentColor"
          >
            <path d="M 794.965 466.603 c 0 -87.3813 -70.8835 -158.265 -158.265 -158.265 c -48.2418 0 -91.4773 21.6178 -120.491 55.7511 c -29.0133 -34.1333 -72.2489 -55.7511 -120.491 -55.7511 c -87.3813 0 -158.265 70.8835 -158.265 158.265 c 0 45.8525 21.0489 84.3093 50.7449 116.167 l 228.807 219.819 L 741.831 585.159 c 28.2169 -29.696 53.1342 -71.3387 53.1342 -118.557 Z" fill="#ffa9b1" />
            <path d="M 457.387 709.632 c -3.18578 -55.7511 -18.2045 -106.041 -18.7733 -108.089 l -13.6533 4.096 c 0.113778 0.341333 2.048 7.05422 4.66489 17.8631 L 361.813 588.117 c 5.12 -5.46133 8.192 -8.64711 8.41955 -8.76089 l -5.00622 -5.12 l -5.00622 -5.12 c -2.95822 2.84445 -72.5902 71.1111 -91.8187 151.211 c -19.3422 80.896 4.66489 123.904 5.68889 125.725 l 12.4018 -7.05422 c -0.113778 -0.113778 3.75467 -6.71289 6.82667 -19.456 l 142.905 -3.86845 c 7.28178 9.78489 16.7253 17.408 28.7858 22.1867 l 5.12 13.312 c 24.1209 -9.32978 41.0738 -28.7858 50.5173 -57.7991 c 7.168 -22.4142 9.89867 -50.6311 7.96445 -83.7405 Z" fill="#9fc8fe" />
            <path d="M 402.773 553.074 m -88.9742 0 a 88.9742 88.9742 0 1 0 177.949 0 a 88.9742 88.9742 0 1 0 -177.949 0 Z" fill="#81b6fe" />
            <path d="M 566.613 709.632 c 3.18578 -55.7511 18.2045 -106.041 18.7733 -108.089 l 13.6533 4.096 c -0.113778 0.341333 -2.048 7.05422 -4.66489 17.8631 l 67.8115 -35.3849 c -5.12 -5.46133 -8.192 -8.64711 -8.41955 -8.76089 l 5.00622 -5.12 l 5.00622 -5.12 c 2.95822 2.84445 72.5902 71.1111 91.8187 151.211 c 19.3422 80.896 -4.66489 123.904 -5.68889 125.725 l -12.4018 -7.05422 c 0.113778 -0.113778 3.75467 -6.71289 6.82667 -19.456 l -142.905 -3.86845 c 7.28178 9.78489 16.7253 17.408 28.7858 22.1867 l -5.12 13.312 c -24.1209 -9.32978 -41.0738 -28.7858 -50.5173 -57.7991 c -7.168 -22.4142 -9.89867 -50.6311 -7.96445 -83.7405 Z" fill="#ff8882" />
            <path d="M 621.227 553.074 m -88.9742 0 a 88.9742 88.9742 0 1 0 177.949 0 a 88.9742 88.9742 0 1 0 -177.949 0 Z" fill="#ff6b6a" />
            <path d="M 9.78503 148.48 v 798.72 h 1012.62 v -798.72 h -1012.62 Z m 943.559 654.677 h -873.813 v -582.542 h 873.813 v 582.542 Z" fill="#e5f1ff" />
          </svg>
        </Reveal>
      </div>
      
      {(() => {
        const galleryImages = [
          "/pictures/1.webp",
          "/pictures/2.webp",
          "/pictures/3.webp",
          "/pictures/4.webp",
          "/pictures/6.webp",
          "/pictures/7.webp",
          "/pictures/8.webp",
          "/pictures/10.webp",
          "/pictures/11.webp",
          "/pictures/12.webp",
          "/pictures/13.webp",
          "/pictures/14.webp"
        ];

        return (
          <>
            {/* Mobile: horizontal scrollable grid */}
            {isMobile && (
              <div className="sm:hidden">
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
                    {galleryImages.map((src, index) => (
                      <motion.div
                        key={src}
                        className="flex-shrink-0 relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                        style={{ width: 200, height: 200 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setCurrentImageIndex(index); setDialogOpen(true); }}
                      >
                        <Image
                          src={src}
                          alt={`תמונה ${index + 1} מפעילות העמותה`}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-xl"
                          sizes="200px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <ImageDialog
                  images={galleryImages}
                  isOpen={dialogOpen}
                  currentIndex={currentImageIndex}
                  onClose={() => setDialogOpen(false)}
                  onNext={() => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)}
                  onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                />
              </div>
            )}

            {/* Desktop/tablet: existing grid */}
            {!isMobile && (
              <HorizontalScrollCarousel images={galleryImages} />
            )}
          </>
        );
      })()}

      {/* מרווח בין גלריה ל'סיפורי משפחות' */}
      <div className="h-8 sm:h-10 md:h-12" />

      {/* סיפורי משפחות עם עדויות אודיו */}
      <FamiliesTestimonials />

      {/* מרווח בין 'סיפורי משפחות' ל'תרומה' */}
      <div className="h-8 sm:h-10 md:h-12" />

      {/* תרומה - מוצג מיד אחרי משפחות מספרות */}
      <DonationSectionFrame />

      {/* מרווח בין 'תרומה' ל'ייעוד העמותה' */}
      <div className="h-8 sm:h-10 md:h-12" />

      {/* ייעוד העמותה - מוצג אחרי סעיף התרומה ללא מרווח */}
      <OrganizationPurpose />

      {/* מרווח בין 'ייעוד העמותה' ל'סיפור העמותה' */}
      <div className="h-8 sm:h-10 md:h-12" />

      {/* סיפור העמותה - מוצג אחרי ייעוד העמותה */}
      <OrganizationStory />
    </div>
  );
};

export default HeroSection;