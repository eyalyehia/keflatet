'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const CanvasRevealEffect = ({
  animationSpeed = 4,
  containerClassName,
  colors = [[125, 211, 252]],
  dotSize = 2,
  showGradient = true,
  className,
}: {
  animationSpeed?: number;
  containerClassName?: string;
  colors?: number[][];
  dotSize?: number;
  showGradient?: boolean;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(canvasRef, { once: true });

  useEffect(() => {
    if (!isInView || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    
    const dots: Dot[] = [];
    const numberOfDots = Math.floor((width * height) / 10000);
    
    class Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        const colorIndex = Math.floor(Math.random() * colors.length);
        this.color = `rgb(${colors[colorIndex].join(',')})`;
        this.size = dotSize * (0.5 + Math.random() * 0.5);
        this.baseX = this.x;
        this.baseY = this.y;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        this.x += (this.baseX - this.x) * 0.05;
        this.y += (this.baseY - this.y) * 0.05;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize dots
    for (let i = 0; i < numberOfDots; i++) {
      dots.push(new Dot());
    }

    let animationFrameId: number;
    
    const render = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw connections between dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Update and draw dots
      dots.forEach(dot => {
        dot.update();
        dot.draw();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    
    // Start animation
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, colors, dotSize]);

  return (
    <div className={`relative w-full h-full ${containerClassName || ''}`}>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${className || ''}`}
      />
      {showGradient && (
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/30" />
      )}
    </div>
  );
};
