'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasRevealEffect } from './canvas-reveal-effect';

export function CanvasRevealEffectDemo({
  onSelect,
  selectedId,
}: {
  onSelect?: (id: 'onetime' | 'monthly' | 'basket' | 'volunteer') => void;
  selectedId?: string;
}) {
  return (
    <div className="py-3 flex flex-row items-center justify-center w-full max-w-[375px] sm:max-w-none gap-2 sm:gap-4 mx-auto px-2 sm:px-3 md:px-4 overflow-x-auto">
      <Card
        title="תרומה חד פעמית"
        description="תרומה חד פעמית שתתרום ישירות לפעילות העמותה"
        icon={<DonationIcon active={selectedId === 'onetime'} />}
        onClick={() => onSelect?.('onetime')}
        active={selectedId === 'onetime'}
      >
        <CanvasRevealEffect
          animationSpeed={5.1}
          containerClassName="bg-[#9acdbe]"
          colors={[[154, 205, 190], [255, 255, 255]]}
        />
      </Card>

      <Card
        title="תרומה חודשית"
        description="הצטרפו למעגל הנתינה הקבוע שלנו"
        icon={<HandshakeIcon active={selectedId === 'monthly'} />}
        onClick={() => onSelect?.('monthly')}
        active={selectedId === 'monthly'}
      >
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-[#9acdbe]"
          colors={[[154, 205, 190], [255, 255, 255]]}
          dotSize={2}
        />
      </Card>

      <Card
        title="סל לתרומה"
        description="חבילת תרומה מיוחדת עם מוצרים נבחרים"
        icon={<HeartIcon active={selectedId === 'basket'} />}
        onClick={() => onSelect?.('basket')}
        active={selectedId === 'basket'}
      >
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-[#9acdbe]"
          colors={[[154, 205, 190], [255, 255, 255]]}
        />
      </Card>
    </div>
  );
}

const Card = ({
  title,
  description,
  icon,
  children,
  className,
  onClick,
  active,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const coarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      const smallWidth = typeof window !== 'undefined' && window.innerWidth <= 768;
      setIsMobile(Boolean(coarse || smallWidth));
    };
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onTouchStart={() => !isMobile && setHovered(true)}
      onTouchEnd={() => !isMobile && setHovered(false)}
      onFocus={() => !isMobile && setHovered(true)}
      onBlur={() => !isMobile && setHovered(false)}
      className={`border-2 group/canvas-card flex items-center justify-center min-w-[110px] w-[110px] sm:w-[130px] md:w-[150px] lg:w-[180px] xl:w-[220px] p-2 sm:p-3 relative h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 rounded-xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer ${
        (hovered || active) ? 'bg-[#f5a383] border-[#f5a383]' : 'bg-[#e1cdbd] border-[#f5a383]'
      } hover:bg-[#f5a383] hover:border-[#f5a383] ${className ?? ''}`}
    >
      <CornerIcon className={`absolute h-4 w-4 -top-2 -left-2 ${hovered ? 'text-white' : 'text-[#f5a383]'} group-hover/canvas-card:text-white`} />
      <CornerIcon className={`absolute h-4 w-4 -bottom-2 -left-2 ${hovered ? 'text-white' : 'text-[#f5a383]'} group-hover/canvas-card:text-white`} />
      <CornerIcon className={`absolute h-4 w-4 -top-2 -right-2 ${hovered ? 'text-white' : 'text-[#f5a383]'} group-hover/canvas-card:text-white`} />
      <CornerIcon className={`absolute h-4 w-4 -bottom-2 -right-2 ${hovered ? 'text-white' : 'text-[#f5a383]'} group-hover/canvas-card:text-white`} />

      {/* Disable animated reveal on mobile */}
      {!isMobile && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              className="h-full w-full absolute inset-0 pointer-events-none"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="relative z-20 p-2 sm:p-3 md:p-4 text-center w-full h-full flex flex-col justify-between">
        <div className="text-center transition-all duration-300 w-full mx-auto flex items-center justify-center mb-2 sm:mb-3">
          {icon}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className={`font-bold mb-2 sm:mb-3 transition-all duration-300 text-[12px] sm:text-[14px] md:text-sm lg:text-base xl:text-lg ${(hovered || active) ? 'text-white' : 'text-black'} group-hover/canvas-card:text-white`}>
            {title}
          </h2>
          <p className={`transition-all duration-300 text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base leading-tight ${(hovered || active) ? 'text-white/95' : 'text-black/95'} group-hover/canvas-card:text-white/95`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const DonationIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="66" height="65" viewBox="0 0 66 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 transition-colors duration-300 group-hover/canvas-card:text-white ${active ? 'text-white' : 'text-black'}`}>
    <path d="M12 22.9185C14.071 14.0991 21.75 7.25 33 7.25C44.25 7.25 54.75 16.25 58 22.9185M12 22.9185C6.8469 24.992 3 27.341 3 30.25C3 34.8301 14.0294 38.5 33 38.5C51.9706 38.5 63 34.8301 63 30.25C63 27.341 59.1531 24.992 54 22.9185M12 22.9185V42.25C12 49.5 21 53.25 33 53.25C45 53.25 54 49.5 54 42.25V22.9185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandshakeIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="66" height="65" viewBox="0 0 66 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 transition-colors duration-300 group-hover/canvas-card:text-white ${active ? 'text-white' : 'text-black'}`}>
    <path d="M21.5 26.5L15.5 32.5M15.5 32.5L21.5 38.5M15.5 32.5H25.5M44.5 26.5L50.5 32.5M50.5 32.5L44.5 38.5M50.5 32.5H40.5M13 19.5L25.5 7M25.5 7L31.5 13M25.5 7V19.5M53 19.5L40.5 7M40.5 7L34.5 13M40.5 7V19.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="66" height="65" viewBox="0 0 66 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 transition-colors duration-300 group-hover/canvas-card:text-white ${active ? 'text-white' : 'text-black'}`}>
    <path d="M33 22.75C33 22.75 38.5 15.5 46.5 15.5C54.5 15.5 58.5 22.75 58.5 30.25C58.5 37.75 46.5 49.5 33 58.5C19.5 49.5 7.5 37.75 7.5 30.25C7.5 22.75 11.5 15.5 19.5 15.5C27.5 15.5 33 22.75 33 22.75Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CornerIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const CornerIcon = ({ className, ...rest }: CornerIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L8 16M8 8l8 8" />
    </svg>
  );
};
