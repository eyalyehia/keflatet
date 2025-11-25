"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { createPortal } from "react-dom"
import getBase64 from "../../utils/getBase64"

interface ImageDialogProps {
  images: string[]
  isOpen: boolean
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) => {
  const [buttonPressed, setButtonPressed] = React.useState<'prev' | 'next' | null>(null)
  const [isNavigating, setIsNavigating] = React.useState(false)
  const [blurDataUrls, setBlurDataUrls] = React.useState<{ [key: string]: string }>({})
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNext = React.useCallback(() => {
    if (isNavigating) return
    
    setIsNavigating(true)
    setButtonPressed('next')
    onNext()
    
    setTimeout(() => {
      setButtonPressed(null)
      setIsNavigating(false)
    }, 300)
  }, [isNavigating, onNext])

  const handlePrev = React.useCallback(() => {
    if (isNavigating) return
    
    setIsNavigating(true)
    setButtonPressed('prev')
    onPrev()
    
    setTimeout(() => {
      setButtonPressed(null)
      setIsNavigating(false)
    }, 300)
  }, [isNavigating, onPrev])

  // מניעת גלילה ברקע כשהדיאלוג פתוח
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // טיפול בלחיצות מקלדת
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'ArrowLeft':
          handlePrev()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose, handleNext, handlePrev])

  // Generate blur placeholders for dialog images
  React.useEffect(() => {
    if (isOpen && images.length > 0) {
      const generateBlurPlaceholders = async () => {
        const blurPromises = images.map(async (src) => {
          const blurData = await getBase64(src)
          return { src, blurData }
        })
        
        const results = await Promise.all(blurPromises)
        const blurMap: { [key: string]: string } = {}
        
        results.forEach(({ src, blurData }) => {
          if (blurData) {
            blurMap[src] = blurData
          }
        })
        
        setBlurDataUrls(blurMap)
      }
      
      generateBlurPlaceholders()
    }
  }, [isOpen, images])

  if (!isOpen) {
    return null
  }

  const dialogContent = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* רקע מטושטש של האתר - לחיצה לסגירה */}
        <motion.div
          className="absolute inset-0 backdrop-blur-md bg-black/70 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* תוכן הדיאלוג */}
        <motion.div
          className="relative z-50 flex flex-col items-center justify-center max-w-4xl mx-auto min-h-screen overflow-y-auto p-4 sm:p-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
        >
          {/* מיכל התמונה עם כפתורים */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 w-full py-4">
            {/* כפתור שמאל (תמונה קודמת) */}
            <motion.button
              onClick={handlePrev}
              disabled={isNavigating}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm ${
                buttonPressed === 'prev' 
                  ? 'bg-[#9acdbe] text-white' 
                  : 'bg-white/90 text-[#f5a383] hover:bg-[#98c5b1] hover:text-white'
              } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: isNavigating ? 1 : 1.1 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </motion.button>

            {/* מיכל התמונה בגודל אחיד לכל התמונות */}
            <div
              className="relative mx-auto rounded-xl overflow-hidden shadow-2xl"
              style={{ width: isMobile ? 300 : 720, height: isMobile ? 360 : 480 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="relative w-full h-full"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.4 
                  }}
                >
                  <Image
                    src={images[currentIndex]}
                    fill
                    quality={85}
                    sizes={isMobile ? "300px" : "720px"}
                    style={{ objectFit: "cover" }}
                    alt={`תמונה ${currentIndex + 1} מפעילות העמותה`}
                    className="cursor-pointer"
                    priority
                    placeholder={blurDataUrls[images[currentIndex]] ? "blur" : "empty"}
                    blurDataURL={blurDataUrls[images[currentIndex]] || undefined}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* כפתור ימין (תמונה הבאה) */}
            <motion.button
              onClick={handleNext}
              disabled={isNavigating}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm ${
                buttonPressed === 'next' 
                  ? 'bg-[#9acdbe] text-white' 
                  : 'bg-white/90 text-[#f5a383] hover:bg-[#98c5b1] hover:text-white'
              } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: isNavigating ? 1 : 1.1 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </motion.button>
          </div>

          {/* נקודות ניווט */}
          <motion.div 
            className="flex justify-center mt-3 space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentIndex && !isNavigating) {
                    // מעבר ישיר לתמונה
                    const diff = index - currentIndex
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) {
                        setTimeout(() => handleNext(), i * 100)
                      }
                    } else {
                      for (let i = 0; i < Math.abs(diff); i++) {
                        setTimeout(() => handlePrev(), i * 100)
                      }
                    }
                  }
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-[#f5a383] scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                disabled={isNavigating}
              />
            ))}
          </motion.div>
          
          {/* כפתור סגירה מתחת לתמונה */}
          <motion.div 
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={onClose}
              disabled={isNavigating}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm ${
                'bg-white/90 text-[#f5a383] hover:bg-[#98c5b1] hover:text-white'
              } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: isNavigating ? 1 : 1.1 }}
              whileTap={{ scale: isNavigating ? 1 : 0.95 }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>


      </motion.div>
    </AnimatePresence>
















  )

  // השתמש ב-portal כדי לוודא שהדיאלוג יופיע מעל הכל
  return typeof document !== 'undefined' 
    ? createPortal(dialogContent, document.body)
    : null
}

export { ImageDialog }
