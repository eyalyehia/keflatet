import { Clock, Mail, Phone, MessageCircle } from "lucide-react"
import Script from "next/script"
import Reveal from "../components/Reveal"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Footer() {
  // זיהוי גודל המסך
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // בדיקה ראשונית
    checkScreenSize();
    
    // האזנה לשינויים בגודל המסך
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundImage: "url('/pictures/bg-footer.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
      {/* Lottie web component loader */}
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
        strategy="afterInteractive"
      />
      {/* Top spacer to visually separate the footer background from the section above without shifting content */}
      <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-[#fdf6ed] z-0"></div>

      {/* Main content container */}
      <div className="flex relative z-10 flex-col min-h-screen">

        {/* Footer section */}
        <footer className="">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start" style={{ marginTop: '300px' }}>
              
              {/* Contact section - left side on desktop, top on mobile */}
              <div className="space-y-8 max-w-md mb-8 lg:mb-0">
                 <Reveal as="h2" type="heading" className="text-4xl md:text-5xl font-staff text-black tracking-wide text-right mt-8 flex items-center justify-start gap-4" dir="rtl">
                  צור קשר
                  <Reveal type="media" className="flex justify-center items-center w-12 h-12 md:w-16 md:h-16">
                    {/* @ts-expect-error - custom element */}
                    <lottie-player
                      autoplay
                      loop
                      mode="normal"
                      src="/animation-json/Love2.json"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Reveal>
                </Reveal>

                {/* Social media icons */}
                <Reveal className="flex justify-start mt-8 space-x-6">
                  <div className="w-14 h-14 rounded-full border border-[#f5a383]/30 flex items-center justify-center hover:bg-[#9acdbe] hover:border-[#9acdbe] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
                    <svg className="w-7 h-7 text-[#f5a383] hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.99z" />
                    </svg>
                  </div>
                  <div className="w-14 h-14 rounded-full border border-[#f5a383]/30 flex items-center justify-center hover:bg-[#9acdbe] hover:border-[#9acdbe] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
                    <svg className="w-7 h-7 text-[#f5a383] hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <a href="https://www.instagram.com/keflatet/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-[#f5a383]/30 flex items-center justify-center hover:bg-[#9acdbe] hover:border-[#9acdbe] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
                    <svg className="w-7 h-7 text-[#f5a383] hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </Reveal>

                {/* Contact information */}
                <div className="space-y-8 text-left" dir="rtl">
                  

                  <div className="flex items-start space-x-4">
                    <Mail className="w-7 h-7 text-[#f5a383] mt-1 flex-shrink-0" />
                    <div>
                      <Reveal as="p" type="paragraph" className="text-black text-xl sm:text-2xl font-staff">keflatet@gmail.com</Reveal>
                    </div>
                  </div>

                  

                  <div className="flex items-start space-x-4">
                    <Phone className="w-7 h-7 text-[#f5a383] mt-1 flex-shrink-0" />
                    <div>
                      <Reveal as="p" type="paragraph" className="text-black text-xl sm:text-2xl font-staff">053-221-7895</Reveal>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo section - right side on desktop, bottom on mobile - מוצמד לקצה הימני */}
              <div className="flex flex-col items-center lg:items-end lg:mr-0 lg:pr-0 lg:justify-center lg:h-full"
                   style={{ marginTop: '-30px' }}>
                {/* Logo with animation */}
                <div
                  className="flex relative justify-center items-center mx-auto lg:mx-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                  style={{
                    zIndex: 10,
                    overflow: 'visible'
                  }}
                >
                  <motion.div
                    initial={{ scale: 1, y: 200 }}
                    animate={isMobile ? {
                      x: [0, 100, 100, -220, -220, 0, 0, 0, 0],
                      y: [0, 0, 300, 300, 0, 0, 0, 0, 35],
                      rotate: -360,
                      scale: [1.5, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.4, 1.5]
                    } : {
                      x: [0, 250, 250, -500, -500, 0, 0, 0, 45],
                      y: [0, 0, 500, 500, 0, 0, 0, 0, 35],
                      rotate: -360,
                      scale: [1.5, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2, 1.5]
                    }}
                    transition={{ 
                      duration: 6, 
                      ease: "easeInOut", 
                      times: [0, 0.02, 0.15, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
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

                {/* Title Image */}
                <div className="flex relative z-20 justify-center lg:justify-end items-center -mt-4 sm:-mt-4 md:-mt-4 lg:-mt-6 w-[100px] sm:w-[160px] md:w-[200px] transition-all duration-300">
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
        </footer>
        {/* Copyright footer (no background) */}
        <footer className="text-center py-12 md:py-6">
          <p className="text-sm text-black">
            © {new Date().getFullYear()} כל הזכויות שמורות | האתר נבנה בשיתוף פעולה בין{" "}
            <a
              href="https://www.orelweb.co.il/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              אוראל בוקריס
            </a>{" "}
            לבין{" "}
            <a
              href="https://www.codesculpt.co.il/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              אייל יחיא
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}