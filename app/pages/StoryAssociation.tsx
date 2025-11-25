'use client';

import React, { useState, useEffect, useRef } from 'react';
import SplitText from '../components/SplitText/SplitText';

interface StoryAssociationProps {
  className?: string;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  delay = 0, 
  className = '', 
  direction = 'up' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransformClass = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'up': return 'opacity-0 translate-y-12';
      case 'down': return 'opacity-0 -translate-y-12';
      case 'left': return 'opacity-0 translate-x-12';
      case 'right': return 'opacity-0 -translate-x-12';
      default: return 'opacity-0 translate-y-12';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
};

interface PersonCardProps {
  name: string;
  description: string;
  imagePlaceholder: string;
  delay?: number;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, description, imagePlaceholder, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatedSection delay={delay} className="flex-1 min-w-[280px] max-w-md">
      <div 
        className="relative bg-gradient-to-br from-[#f5a383]/5 to-[#9acdbe]/5 rounded-3xl p-6 sm:p-8 border border-[#f5a383]/10 transition-all duration-500 hover:shadow-2xl hover:scale-105 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative corner */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#f5a383] rounded-full opacity-60 animate-pulse"></div>
        
        {/* Image placeholder */}
        <div className="relative mb-6 mx-auto w-32 h-32 bg-gradient-to-br from-[#f5a383]/20 to-[#9acdbe]/20 rounded-full flex items-center justify-center border-4 border-[#f5a383]/20 group-hover:border-[#f5a383]/40 transition-all duration-300">
          <span className="text-4xl transform transition-all duration-300 group-hover:scale-110">
            {imagePlaceholder}
          </span>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br from-[#f5a383]/10 to-[#9acdbe]/10 rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-[#2a2b26] font-staff text-center mb-4 group-hover:text-[#f5a383] transition-colors duration-300">
          {name}
        </h3>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#2a2b26]/80 font-staff text-center leading-relaxed">
          {description}
        </p>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-[#f5a383]/5 to-[#9acdbe]/5 rounded-3xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
    </AnimatedSection>
  );
};

const BiblicalQuote: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className="relative py-16 sm:py-20" >
      <div className="relative bg-gradient-to-br from-[#f5a383]/10 to-[#9acdbe]/10 rounded-3xl p-12 sm:p-16 lg:p-20 border-2 border-[#f5a383]/20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#f5a383] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#9acdbe] rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Corner decorations */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#f5a383] rounded-full opacity-70 animate-ping"></div>
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-[#9acdbe] rounded-full opacity-70 animate-ping"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#9acdbe] rounded-full opacity-70 animate-ping"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#f5a383] rounded-full opacity-70 animate-ping"></div>

        {/* Main quote */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <span className="text-6xl sm:text-7xl lg:text-8xl opacity-20">״</span>
          </div>
          
          {/* SplitText Animation for Biblical Quote */}
          <div className="mb-6">
            <SplitText
              text="ואהבת לרעך כמוך"
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#2a2b26] font-staff leading-tight"
              delay={200}
              duration={0.8}
              ease="ease-out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="center"
              stagger={150}
              animationType="wave"
              containerClassName="relative z-10"
              onLetterAnimationComplete={() => console.log("סיום אנימציה של הציטוט המקראי")}
            />
          </div>
          
          <div className="mt-8">
            <span className="text-6xl sm:text-7xl lg:text-8xl opacity-20">״</span>
          </div>

          {/* Animated underline */}
          <div className={`mx-auto mt-8 h-1 bg-gradient-to-r from-[#f5a383] to-[#9acdbe] rounded-full transition-all duration-1000 ${isVisible ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}></div>
        </div>
      </div>
    </div>
  );
};

const DonationButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDonationClick = () => {
    window.open('https://www.matara.pro/nedarimplus/online/?mosad=7014073', '_blank');
  };

  return (
    <button
      onClick={handleDonationClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-[#f5a383] to-[#9acdbe] hover:from-[#e0ccbc] hover:to-[#e0ccbc] rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 font-staff overflow-hidden ${className}`}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-[#e0ccbc] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      {/* Button content */}
      <div className="relative z-10 flex items-center">
        <span className="mr-3 text-2xl sm:text-3xl animate-pulse">💝</span>
        <span>תרמו עכשיו</span>
        <span className="ml-3 text-2xl sm:text-3xl group-hover:translate-x-1 transition-transform duration-300">←</span>
      </div>

      {/* Floating hearts */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationName: 'ping',
                animationDuration: '1s',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.2}s`
              }}
            >
              💖
            </div>
          ))}
        </div>
      )}
    </button>
  );
};

const StoryAssociation: React.FC<StoryAssociationProps> = ({ className = '' }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {}, 300);
        }
      });
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section className={`relative py-16 sm:py-20 lg:py-28 bg-[#fdf6ed] overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-16 w-48 h-48 bg-[#f5a383] rounded-full blur-3xl"
             style={{
               animationName: 'pulse',
               animationDuration: '2s',
               animationIterationCount: 'infinite'
             }}></div>
        <div className="absolute bottom-32 right-16 w-56 h-56 bg-[#9acdbe] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 left-1/4 w-40 h-40 bg-[#f5a383] rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-10 animate-float"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`
            }}
          >
            {i % 6 === 0 ? '💝' : i % 6 === 1 ? '🤲' : i % 6 === 2 ? '❤️' : i % 6 === 3 ? '🌟' : i % 6 === 4 ? '✨' : '🕊️'}
          </div>
        ))}
      </div>

      {/* CSS Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.2;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .group:hover .animate-heartbeat {
          animation: heartbeat 1s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <AnimatedSection delay={200}>
          <div className="text-center mb-16 sm:mb-20">
            <div className="relative inline-block mb-8">
               {/* Main Title with SplitText Animation */}
               <SplitText
                 text="סיפור העמותה"
                 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#2a2b26] font-staff mb-6 hover:scale-105 cursor-pointer"
                 delay={100}
                 duration={1.0}
                 ease="ease-out"
                 splitType="chars"
                 from={{ opacity: 0, y: 60 }}
                 to={{ opacity: 1, y: 0 }}
                 threshold={0.2}
                 rootMargin="-80px"
                 textAlign="center"
                 stagger={80}
                 animationType="bounce"
                 containerClassName="transition-all duration-500"
                 onLetterAnimationComplete={() => console.log("סיום אנימציה של כותרת סיפור העמותה")}
               />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5a383] to-[#9acdbe] rounded-full"></div>
            </div>
          </div>
        </AnimatedSection>

        {/* Opening Statement */}
        <AnimatedSection delay={400}>
          <div className="relative bg-gradient-to-br from-[#f5a383]/5 to-[#9acdbe]/5 rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#f5a383]/10 mb-16 sm:mb-20">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-5xl bg-[#fdf6ed] px-6 py-3 rounded-full shadow-lg border-2 border-[#f5a383]/20">
              🎯
            </div>
            
            <div className="pt-8 text-center">
              {/* Question with SplitText Animation */}
              <SplitText
                text="למה קראנו לעמותה כיף לתת?"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a2b26] font-staff mb-6"
                delay={300}
                duration={0.7}
                ease="ease-out"
                splitType="words"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.15}
                rootMargin="-60px"
                textAlign="center"
                stagger={120}
                animationType="slide"
                containerClassName=""
                onLetterAnimationComplete={() => console.log("סיום אנימציה של השאלה")}
              />
              <p className="text-xl sm:text-2xl lg:text-3xl text-[#2a2b26] font-staff leading-relaxed font-semibold">
                אם ישאלו אותנו מה הדבר שאנחנו הכי אוהבים, נענה חד משמעית ש
                <span className="relative inline-block mx-2 px-4 py-2 bg-gradient-to-r from-[#f5a383]/20 to-[#9acdbe]/20 rounded-xl font-extrabold hover:scale-110 transition-transform duration-300 cursor-pointer">
                  לתת לאחר
                </span>
                זה הדבר הכי כיף בעולם!
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Foundation Story */}
        <AnimatedSection delay={600} direction="right">
          <div className="relative bg-gradient-to-br from-[#9acdbe]/5 to-[#f5a383]/5 rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#9acdbe]/10 mb-16 sm:mb-20">
            <div className="absolute -top-6 right-8 text-5xl bg-[#fdf6ed] px-6 py-3 rounded-full shadow-lg border-2 border-[#9acdbe]/20">
              🏠
            </div>
            
            <div className="text-center lg:text-right">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a2b26] font-staff mb-6">
                רקע על העמותה
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-[#2a2b26] font-staff leading-relaxed">
                העמותה הוקמה על שמם של{' '}
                <strong className="font-extrabold text-[#f5a383] hover:text-[#9acdbe] transition-colors duration-300 cursor-pointer">
                  יוסף ומסעודה כנפו ז״ל
                </strong>
                , שעלו לארץ והקדישו את חייהם לגידול 14 ילדים, שחונכו לערכים של{' '}
                <span className="relative inline-block px-3 py-1 bg-gradient-to-r from-[#f5a383]/20 to-[#9acdbe]/20 rounded-lg font-bold">
                  אהבת הזולת ואהבת הארץ
                </span>
                .
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Honor Section */}
        <AnimatedSection delay={800}>
          <div className="mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2a2b26] font-staff text-center mb-12">
              הוקרה לאנשים יקרים
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-stretch">
              <PersonCard
                name="מרים אלימלך ז״ל"
                description="הקדישה את חייה לגידול ילדיה ושימשה כוח עזר בבית החולים סורוקה במסירות רבה ואהבת אדם."
                imagePlaceholder="👩‍⚕️"
                delay={1000}
              />
              
              <PersonCard
                name="פרופ׳ יעקב זביצקי ז״ל"
                description="שירת את ישראל בכבוד ונתן בסתר לנצרכים, יחד עם רעייתו יהודית תבדל״א."
                imagePlaceholder="👨‍🎓"
                delay={1200}
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Biblical Quote */}
        <BiblicalQuote />

        {/* Current Activity */}
        <AnimatedSection delay={1400}>
          <div className="relative bg-gradient-to-br from-[#f5a383]/8 to-[#9acdbe]/8 rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#f5a383]/15 mb-16 sm:mb-20">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-5xl bg-[#fdf6ed] px-6 py-3 rounded-full shadow-lg border-2 border-[#f5a383]/20">
              🎁
            </div>
            
            <div className="pt-8 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a2b26] font-staff mb-6">
                היום העמותה פועלת כך
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-[#2a2b26] font-staff leading-relaxed max-w-4xl mx-auto">
                אנו מחלקים באופן קבוע{' '}
                <span className="font-bold text-[#f5a383]">סלי מזון עשירים</span>{' '}
                למאות משפחות, ושואפים להרחיב את החלוקה שלנו לכמות גדולה יותר של משפחות.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection delay={1600}>
          <div className="text-center">
            <div className="relative bg-gradient-to-br from-[#9acdbe]/10 to-[#f5a383]/10 rounded-3xl p-12 sm:p-16 lg:p-20 border-2 border-[#9acdbe]/20 mb-12">
              {/* Corner decorations */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#9acdbe] rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-[#f5a383] rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#f5a383] rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#9acdbe] rounded-full opacity-60 animate-ping"></div>
              
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-5xl bg-[#fdf6ed] px-6 py-3 rounded-full shadow-xl border-2 border-[#9acdbe]/20">
                🤝
              </div>
              
              <div className="pt-6">
                {/* Final Call to Action with SplitText */}
                <SplitText
                  text="בואו נהיה שותפים"
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a2b26] font-staff mb-8"
                  delay={200}
                  duration={0.9}
                  ease="ease-out"
                  splitType="words"
                  from={{ opacity: 0, y: 35 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-40px"
                  textAlign="center"
                  stagger={200}
                  animationType="typewriter"
                  containerClassName=""
                  onLetterAnimationComplete={() => console.log("סיום אנימציה של קריאה לפעולה")}
                />
                
                <p className="text-lg sm:text-xl lg:text-2xl text-[#2a2b26] font-staff leading-relaxed mb-10 max-w-4xl mx-auto">
                  נשמח להיות שותפים אתכם בסיוע למשפחות במצוקה.{' '}
                  <span className="font-bold text-[#f5a383]">כל תרומה, קטנה או גדולה</span>
                  , תסייע לנו להמשיך את המפעל החשוב הזה.
                </p>
                
                <DonationButton />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom decorative section */}
        <AnimatedSection delay={1800}>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="text-8xl sm:text-9xl opacity-15 transform transition-all duration-700 hover:scale-110 cursor-pointer">
                💝
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#f5a383]/20 to-[#9acdbe]/20 rounded-full blur-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <p className="mt-6 text-lg sm:text-xl text-[#2a2b26]/70 font-staff font-semibold">
              תודה שאתם חלק מהסיפור שלנו
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* CSS Custom Animations */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.1);
          }
        }

        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
          }
          100% { 
            background-position: 200% 0;
          }
        }

        .group:hover .animate-heartbeat {
          animation: heartbeat 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default StoryAssociation;