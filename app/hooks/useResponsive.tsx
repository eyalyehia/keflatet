import { useState, useEffect } from 'react';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width <= 640;
      const isTablet = width > 640 && width <= 1024;
      const isDesktop = width > 1024;

      setState({
        isMobile,
        isTablet,
        isDesktop,
        width,
        height,
      });

      console.log('📱 Responsive Update:', {
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        userAgent: navigator.userAgent,
      });
    };

    // בדיקה ראשונית
    updateResponsive();

    // האזנה לשינויים
    window.addEventListener('resize', updateResponsive);
    window.addEventListener('orientationchange', updateResponsive);

    return () => {
      window.removeEventListener('resize', updateResponsive);
      window.removeEventListener('orientationchange', updateResponsive);
    };
  }, []);

  return state;
};
