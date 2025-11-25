"use client";
import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  name: string;
  audioPath: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
  onAudioPlay: (audioPath: string) => void;
  playingAudio: string | null;
  animationsPaused: boolean;
}) => {

  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: props.animationsPaused ? "0%" : "-50%",
        }}
        transition={{
          duration: props.animationsPaused ? 0 : (props.duration || 10),
          repeat: props.animationsPaused ? 0 : Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, audioPath }, i) => (
                <div 
                  className="p-6 rounded-3xl border border-[#f5a383]/20 shadow-lg bg-[#fdf6ed] max-w-xs w-full relative" 
                  key={`${index}-${i}`}
                >
                  <div className="text-[#2a2b26] font-staff leading-relaxed mb-4">
                    &ldquo;{text}&rdquo;
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f5a383] flex items-center justify-center">
                        <span className="text-white font-bold font-staff text-sm">
                          {name.charAt(0)}
                        </span>
                      </div>
                      <div className="font-medium font-staff tracking-tight leading-5 text-[#2a2b26]">
                        {name}
                      </div>
                    </div>
                    
                    {/* כפתור האודיו */}
                    <button
                      onClick={() => props.onAudioPlay(audioPath)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        props.playingAudio === audioPath 
                          ? 'bg-[#98c5b1] text-white scale-110' 
                          : 'bg-[#f5a383]/20 text-[#f5a383] hover:bg-[#98c5b1] hover:text-white'
                      }`}
                      title="השמע עדות"
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className={props.playingAudio === audioPath ? 'animate-pulse' : ''}
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* קובץ האודיו הנסתר */}
                  <audio
                    id={audioPath}
                    preload="none"
                  >
                    <source src={audioPath} type="video/mp4" />
                  </audio>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};