import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Variants } from "framer-motion"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export const SlidUp = (delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: delay,
      },
    },
  };
};

export const SlidUpLeft = (delay = 0): Variants => {
  return {
    hidden: {
      opacity: 0,
      x: 100,
      y: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: delay,
      },
    },
  };
};

export const SlidUpRight = (delay = 0) => {
  return {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
         delay: delay,
      },
    },
  };
};