'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DesignationProps {
  className?: string;
}

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface KeywordProps {
  children: React.ReactNode;
  className?: string;
}

const HighlightedKeyword: React.FC<KeywordProps> = ({ children, className = '' }) => {
  return (
    <span className={`relative inline-block group cursor-pointer ${className}`}>
      <span className="relative z-10 font-bold font-staff text-[#2a2b26] group-hover:text-white transition-colors duration-300">
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-[#f5a383] to-[#9acdbe] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md transform scale-x-0 group-hover:scale-x-100 origin-center"></span>
      <span className="absolute inset-0 bg-gradient-to-r from-[#f5a383]/20 to-[#9acdbe]/20 rounded-md animate-pulse opacity-0 group-hover:opacity-100"></span>
    </span>
  );
};

interface FloatingIconProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`inline-block transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      } ${className}`}
      style={{ 
        animation: isVisible ? 'iconFloat 4s ease-in-out infinite' : 'none'
      }}
    >
      {children}
    </div>
  );
};

const Designation: React.FC<DesignationProps> = ({ className = '' }) => {


  return (
    <section className={`relative py-16 sm:py-20 lg:py-28 bg-[#fdf6ed] overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#f5a383] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#9acdbe] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#f5a383] rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Floating decorative hearts and hands */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            {i % 4 === 0 ? '🤝' : i % 4 === 1 ? '💙' : i % 4 === 2 ? '🌟' : '✨'}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Section */}
        <AnimatedText delay={200}>
          <div className="text-center mb-16 sm:mb-20">
            {/* Main Title */}
            <div className="relative inline-block mb-8">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-staff text-[#2a2b26] mb-6 transition-all duration-500 hover:scale-105 cursor-pointer">
                ייעוד העמותה
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5a383] to-[#9acdbe] rounded-full"></div>
              
              {/* Decorative elements around title */}
              <FloatingIcon delay={1000} className="absolute -top-4 -left-8 text-3xl">
                🤝
              </FloatingIcon>
              <FloatingIcon delay={1500} className="absolute -top-4 -right-8 text-3xl">
                💙
              </FloatingIcon>
            </div>

            <p className="text-lg sm:text-xl text-[#2a2b26]/70 font-staff max-w-2xl mx-auto leading-relaxed">
              המשימה שלנו
            </p>
          </div>
        </AnimatedText>

        {/* Main Content */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* First Paragraph */}
          <AnimatedText delay={600}>
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="flex-1 text-center lg:text-right">
                  <div className="relative bg-gradient-to-br from-[#f5a383]/5 to-[#9acdbe]/5 rounded-3xl p-8 sm:p-10 lg:p-12 border border-[#f5a383]/10">
                    <FloatingIcon delay={800} className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl bg-[#fdf6ed] px-4 py-2 rounded-full shadow-lg">
                      🎯
                    </FloatingIcon>
                    
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold font-staff text-[#2a2b26] leading-relaxed">
                      מטרתנו היא לחזק את{' '}
                      <HighlightedKeyword>הערבות ההדדית</HighlightedKeyword>{' '}
                      של תושבי מדינת ישראל,
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-24 flex justify-center">
                  <FloatingIcon delay={1000} className="text-6xl">
                    🇮🇱
                  </FloatingIcon>
                </div>
              </div>
            </div>
          </AnimatedText>

          {/* Connection Arrow */}
          <AnimatedText delay={1000}>
            <div className="flex justify-center">
              <div className="w-px h-16 bg-gradient-to-b from-[#f5a383] to-[#9acdbe] relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#f5a383] rounded-full animate-pulse"></div>
              </div>
            </div>
          </AnimatedText>

          {/* Second Paragraph */}
          <AnimatedText delay={1200}>
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12">
                <div className="flex-1 text-center lg:text-left">
                  <div className="relative bg-gradient-to-br from-[#9acdbe]/5 to-[#f5a383]/5 rounded-3xl p-8 sm:p-10 lg:p-12 border border-[#9acdbe]/10">
                    <FloatingIcon delay={1400} className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl bg-[#fdf6ed] px-4 py-2 rounded-full shadow-lg">
                      🌉
                    </FloatingIcon>
                    
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold font-staff text-[#2a2b26] leading-relaxed">
                      על ידי יצירת{' '}
                      <HighlightedKeyword>חיבור</HighlightedKeyword>{' '}
                      בין כל מי שרוצה לסייע לכל מי שזקוק לסיוע.
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-24 flex justify-center">
                  <FloatingIcon delay={1600} className="text-6xl">
                    🤲
                  </FloatingIcon>
                </div>
              </div>
            </div>
          </AnimatedText>

          {/* Connection Arrow */}
          <AnimatedText delay={1600}>
            <div className="flex justify-center">
              <div className="w-px h-16 bg-gradient-to-b from-[#9acdbe] to-[#f5a383] relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#9acdbe] rounded-full animate-pulse"></div>
              </div>
            </div>
          </AnimatedText>

          {/* Third Paragraph - Main Message */}
          <AnimatedText delay={1800}>
            <div className="relative">
              <div className="text-center">
                <div className="relative bg-gradient-to-br from-[#f5a383]/10 to-[#9acdbe]/10 rounded-3xl p-10 sm:p-12 lg:p-16 border-2 border-[#f5a383]/20 max-w-5xl mx-auto">
                  {/* Decorative corner elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#f5a383] rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute -top-4 -right-4 w-6 h-6 bg-[#9acdbe] rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#9acdbe] rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#f5a383] rounded-full opacity-60 animate-ping"></div>
                  
                  <FloatingIcon delay={2000} className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-5xl bg-[#fdf6ed] px-6 py-3 rounded-full shadow-xl border-2 border-[#f5a383]/20">
                    ⭐
                  </FloatingIcon>
                  
                  <div className="pt-6">
                    <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-staff text-[#2a2b26] leading-relaxed mb-6">
                      <HighlightedKeyword>ההתנדבות</HighlightedKeyword>{' '}
                      היא המפתח לחיזוק{' '}
                      <HighlightedKeyword>הערבות ההדדית</HighlightedKeyword>{' '}
                      ולבניית{' '}
                      <HighlightedKeyword>חברה טובה</HighlightedKeyword>{' '}
                      וחזקה יותר.
                    </p>
                    
                    <div className="flex justify-center space-x-6 mt-8">
                      <FloatingIcon delay={2200} className="text-4xl">🤝</FloatingIcon>
                      <FloatingIcon delay={2400} className="text-4xl">💙</FloatingIcon>
                      <FloatingIcon delay={2600} className="text-4xl">🌟</FloatingIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedText>
        </div>

        {/* Bottom decorative section */}
        <AnimatedText delay={2200}>
          <div className="mt-20 text-center">
            <div className="relative inline-block">
              <div className="text-8xl sm:text-9xl opacity-10 transform transition-all duration-700 hover:scale-110 cursor-pointer">
                🤝
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#f5a383]/20 to-[#9acdbe]/20 rounded-full blur-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </AnimatedText>
      </div>

      {/* CSS Custom Animations */}
      <style jsx>{`
        @keyframes iconFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-8px) rotate(2deg);
          }
          50% { 
            transform: translateY(-4px) rotate(-1deg);
          }
          75% { 
            transform: translateY(-12px) rotate(1deg);
          }
        }

        @keyframes gradientShift {
          0%, 100% { 
            background-position: 0% 50%;
          }
          50% { 
            background-position: 100% 50%;
          }
        }

        .group:hover .group-hover\\:scale-x-100 {
          animation: highlightExpand 0.3s ease-out forwards;
        }

        @keyframes highlightExpand {
          0% { 
            transform: scaleX(0);
          }
          100% { 
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
};

export default Designation;