"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Interfaces
interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: { [key: string]: string | number };
  to?: { [key: string]: string | number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: "center" | "right" | "left";
  onLetterAnimationComplete?: () => void;
  stagger?: number;
  containerClassName?: string;
  animationType?: "fade" | "slide" | "bounce" | "typewriter" | "wave";
}

interface SplitTextElement {
  char: string;
  index: number;
  isVisible: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
  ease = "ease-out",
  splitType = "chars",
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
  stagger = 30, // in milliseconds for CSS animations
  containerClassName = "",
  animationType = "fade"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<SplitTextElement[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Split text into individual elements
  useEffect(() => {
    if (!text) return;

    const splitElements: SplitTextElement[] = [];
    
    if (splitType === "chars") {
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== " ") {
          splitElements.push({
            char: text[i],
            index: i,
            isVisible: false
          });
        } else {
          splitElements.push({
            char: "\u00A0", // Non-breaking space
            index: i,
            isVisible: false
          });
        }
      }
    } else if (splitType === "words") {
      const words = text.split(" ");
      words.forEach((word, index) => {
        splitElements.push({
          char: word,
          index: index,
          isVisible: false
        });
      });
    }

    setElements(splitElements);
  }, [text, splitType]);

  const startAnimation = useCallback(() => {
    // Start animation with stagger
    elements.forEach((_, index) => {
      setTimeout(() => {
        setElements(prev => 
          prev.map((element, i) => 
            i === index 
              ? { ...element, isVisible: true }
              : element
          )
        );
      }, delay + (index * stagger));
    });

    // Call completion callback
    if (onLetterAnimationComplete) {
      setTimeout(() => {
        onLetterAnimationComplete();
      }, delay + (elements.length * stagger) + (duration * 1000));
    }
  }, [elements, delay, stagger, duration, onLetterAnimationComplete]);

  // Intersection Observer setup
  useEffect(() => {
    if (!containerRef.current || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            setIsVisible(true);
            setAnimationStarted(true);
            startAnimation();
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [elements, animationStarted, threshold, rootMargin, startAnimation]);

  const getTextAlign = () => {
    switch (textAlign) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "left":
        return "text-left";
      default:
        return "text-center";
    }
  };

  const getAnimationClass = (element: SplitTextElement) => {
    if (!isVisible) return "split-text-hidden";
    
    const baseClass = element.isVisible ? "split-text-visible" : "split-text-hidden";
    const animationClass = `split-text-${animationType}`;
    
    return `${baseClass} ${animationClass}`;
  };

  return (
    <div
      ref={containerRef}
      className={`split-text-container ${getTextAlign()} ${containerClassName}`}
      style={{ direction: /[\u0590-\u05FF]/.test(text) ? "rtl" : "ltr" }}
    >
      <div className={`inline-block ${className}`}>
        {elements.map((element, index) => (
          <span
            key={`${element.char}-${index}`}
            className={`split-text-element inline-block ${getAnimationClass(element)} ${
              element.char === "\u00A0" ? "w-2" : ""
            }`}
            style={{
              display: element.char === "\u00A0" ? "inline-block" : "inline-block",
              whiteSpace: "pre",
              [`--stagger-delay`]: `${delay + (index * stagger)}ms`,
              [`--animation-duration`]: `${duration * 1000}ms`,
            } as React.CSSProperties}
          >
            {element.char}
          </span>
        ))}
      </div>

      <style jsx>{`
        .split-text-container {
          overflow: visible;
        }
        
        .split-text-element {
          will-change: transform, opacity;
          backface-visibility: hidden;
          perspective: 1000px;
          transition: transform 0.2s ease;
        }

        .split-text-element:hover {
          transform: scale(1.05);
        }

        /* Animation States */
        .split-text-hidden {
          opacity: 0;
          transform: translateY(${from.y || 50}px);
        }

        .split-text-visible {
          opacity: 1;
          transform: translateY(${to.y || 0}px);
        }

        /* Animation Types with CSS Variables */
        .split-text-fade {
          animation: splitTextFade var(--animation-duration, ${duration * 1000}ms) ${ease} var(--stagger-delay, ${delay}ms) forwards;
        }

        .split-text-slide {
          animation: splitTextSlide var(--animation-duration, ${duration * 1000}ms) ${ease} var(--stagger-delay, ${delay}ms) forwards;
        }

        .split-text-bounce {
          animation: splitTextBounce var(--animation-duration, ${duration * 1000}ms) cubic-bezier(0.68, -0.55, 0.265, 1.55) var(--stagger-delay, ${delay}ms) forwards;
        }

        .split-text-typewriter {
          animation: splitTextTypewriter 0.1s ease var(--stagger-delay, ${delay}ms) forwards;
        }

        .split-text-wave {
          animation: splitTextWave var(--animation-duration, ${duration * 1000}ms) ${ease} var(--stagger-delay, ${delay}ms) forwards;
        }

        /* Keyframes */
        @keyframes splitTextFade {
          from {
            opacity: ${from.opacity || 0};
            transform: translateY(${from.y || 50}px);
          }
          to {
            opacity: ${to.opacity || 1};
            transform: translateY(${to.y || 0}px);
          }
        }

        @keyframes splitTextSlide {
          from {
            opacity: ${from.opacity || 0};
            transform: translateX(-30px) translateY(${from.y || 50}px);
          }
          to {
            opacity: ${to.opacity || 1};
            transform: translateX(0px) translateY(${to.y || 0}px);
          }
        }

        @keyframes splitTextBounce {
          0% {
            opacity: ${from.opacity || 0};
            transform: translateY(${from.y || 50}px) scale(0.3);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.1);
          }
          100% {
            opacity: ${to.opacity || 1};
            transform: translateY(${to.y || 0}px) scale(1);
          }
        }

        @keyframes splitTextTypewriter {
          from {
            opacity: ${from.opacity || 0};
          }
          to {
            opacity: ${to.opacity || 1};
          }
        }

        @keyframes splitTextWave {
          0% {
            opacity: ${from.opacity || 0};
            transform: translateY(${from.y || 50}px);
          }
          25% {
            opacity: 0.7;
            transform: translateY(-15px);
          }
          50% {
            opacity: 1;
            transform: translateY(-5px);
          }
          100% {
            opacity: ${to.opacity || 1};
            transform: translateY(${to.y || 0}px);
          }
        }

        /* RTL Support */
        [dir="rtl"] .split-text-element {
          unicode-bidi: isolate;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .split-text-element {
            font-size: 0.9em;
          }
        }
      `}</style>
    </div>
  );
};

export default SplitText;