"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { HandHeart, Building2, Target } from "lucide-react"
import { Button } from "../components/ui/MovingBorder"
import { useRef, useState, useEffect } from "react"
import Reveal from "../components/Reveal"

export default function OrganizationPurpose() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const yTransform = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  const [isLottieLoaded, setIsLottieLoaded] = useState(false)

  // Load Lottie player script
  useEffect(() => {
    const loadLottie = async () => {
      if (typeof window !== "undefined" && !window.customElements.get("lottie-player")) {
        try {
          const script = document.createElement("script")
          script.src =
            "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
          script.onload = () => {
            setIsLottieLoaded(true)
          }
          script.onerror = () => {
            setIsLottieLoaded(false)
          }
          document.head.appendChild(script)
        } catch (error) {
          console.error("Error loading Lottie:", error)
          setIsLottieLoaded(false)
        }
      } else {
        setIsLottieLoaded(true)
      }
    }

    loadLottie()
  }, [])
  
  const purposes = [
    {
      icon: Target,
      animationPath: "/animation-json/A.json",
      title: "ערבות הדדית",
      description: "מטרתנו היא לחזק את הערבות הדדית של תושבי מדינת ישראל",
    },
    {
      icon: HandHeart,
      animationPath: "/animation-json/B.json",
      title: "חיבור וסיוע",
      description: "על ידי יצירת חיבור בין כל מי שרוצה לסייע לכל מי שזקוק לסיוע",
    },
    {
      icon: Building2,
      animationPath: "/animation-json/C.json",
      title: "בניית חברה",
      description: "ההתנדבות היא המפתח לחיזוק הערבות ההדדית ולבניית חברה טובה וחזקה יותר",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 12, duration: 0.8 },
    },
  }

  // Animation Component with safe fallback
  const AnimationIcon = ({ animationPath, IconComponent, index }) => {
    const [error, setError] = useState(false)
    const validSrc =
      typeof animationPath === "string" && animationPath.trim() !== "" ? animationPath : null

    if (!isLottieLoaded || error || !validSrc) {
      return (
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        >
          <IconComponent className="w-full h-full text-[#9dd0bf]" />
        </motion.div>
      )
    }

    return (
      <div
        className="w-full h-full"
        style={{ minHeight: "48px", minWidth: "48px" }}
      >
        <lottie-player
          src={validSrc}
          background="transparent"
          speed="1"
          loop
          autoplay
          style={{ width: "100%", height: "100%", minHeight: "48px", minWidth: "48px" }}
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <motion.section
      id="ייעוד-העמותה"
      ref={ref}
      className="overflow-hidden px-4 pt-0 pb-16"
      dir="rtl"
      style={{ opacity: opacityTransform }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="pt-16 mb-12 text-center">
          <Reveal as="h2" type="heading" className="mb-4 text-2xl font-bold font-staff tracking-tighter text-[#2a2b26] sm:text-3xl md:text-4xl lg:text-5xl flex items-center justify-center gap-3">
            ייעוד העמותה
          </Reveal>
          <div className="w-24 h-1 bg-gradient-to-r from-[#f5a383] to-[#9dd0bf] mx-auto rounded-full" />
          
          {/* Lottie Animation */}
          <div className="flex justify-center mt-8">
            <Reveal type="media" as="div" className="w-32 h-32 md:w-40 md:h-40">
              {isLottieLoaded && (
                <lottie-player
                  src="/animation-json/58.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  className="w-full h-full"
                  style={{ width: 'auto', height: 'auto' }}
                />
              )}
            </Reveal>
          </div>
        </div>

        {/* Purpose Cards */}
        <motion.div
          className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6 sm:items-stretch"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {purposes.map((purpose, index) => {
            const IconComponent = purpose.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, rotateY: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ y: yTransform }}
                className="w-full max-w-[300px] h-[220px] sm:max-w-none sm:h-40 md:h-44 lg:h-56 xl:h-60"
              >
                <Button
                  duration={Math.floor(Math.random() * 10000) + 10000}
                  borderRadius="1.75rem"
                  style={{
                    background: "#fef7f1",
                    borderRadius: `calc(1.75rem* 0.96)`,
                    border: "2px solid #9acdbe",
                    width: "100%",
                  }}
                  className="!w-full h-full block text-black dark:text-white border-[#9acdbe] shadow-sm"
                >
                  <div className="flex flex-col items-center justify-center p-6 h-full space-y-4">
                    <div className="flex-shrink-0">
                      <Reveal type="media" as="div">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                          className="w-2 h-2 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3 xl:h-3 flex items-center justify-center"
                        >
                          <AnimationIcon
                            animationPath={purpose.animationPath}
                            IconComponent={IconComponent}
                            index={index}
                          />
                        </motion.div>
                      </Reveal>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2 flex-1 justify-center">
                      <Reveal as="h3" type="heading" className="font-bold font-staff tracking-tighter text-lg text-[#2a2b26]">
                        {purpose.title}
                      </Reveal>
                      <Reveal as="p" type="paragraph" className="text-sm text-[#2a2b26] px-2 max-w-[250px]">
                        {purpose.description}
                      </Reveal>
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
