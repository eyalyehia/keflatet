'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export const HeroSimple = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show content after a short delay
    const timeout = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#fdf6ed]">
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
        <div className="flex relative z-20 flex-col justify-center items-center px-10 h-full text-center" >
          <div 
            className={`transition-all duration-2000 ${
              isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-10'
            }`}
            style={{ transform: 'translateY(-120px)' }}
          >
                         {/* Content Wrapper - עטיפה חדשה */}
             <div className="flex flex-col items-center">
                                                                    {/* Logo Image - מיקום וגודל התמונה */}
               <div className="flex relative justify-center items-center mx-auto mb-0 w-64 h-64 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 hero-image-container"
                    style={{ 
                      transform: 'translateY(-40px)'
                    }}
               >
                 <Image
                   src="/noBg.png"
                   alt="Logo"
                   width={320}
                   height={320}
                   className="object-contain w-full h-full transition-all duration-500 ease-in-out cursor-pointer hover:scale-110 hover:rotate-3 active:scale-95"
                   style={{
                     filter: 'drop-shadow(0 0 20px rgba(42, 43, 38, 0.3))',
                   }}
                   priority
                 />
               </div>

                   {/* Title Image - תמונת הכותרת */}
                   <div className="flex justify-center items-center"
                        style={{ 
                          marginTop: '-120px'
                        }}
                   >
                     <div className="w-[200px] sm:w-[250px] md:w-[300px] transition-all duration-300">
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
          </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#f5a383]/70 transition-all duration-1000 ${
            isVisible ? 'opacity-100 animate-bounce' : 'opacity-0'
          }`}
          style={{ animationDelay: '1.5s' }}
        >
          <div className="flex flex-col items-center space-y-2 px-6 py-3 border border-[#f5a383]/20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium font-staff">גלול למטה</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="animate-pulse"
            >
              <path 
                d="M12 5V19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M7 14L12 19L17 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
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
  );
};

export default HeroSimple;