"use client";

import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { SlidUpRight, SlidUpLeft } from "../lib/utils"
import NavigationBar from "../pages/Navbar"
import Lottie from "lottie-react"
import { useEffect, useState } from "react"

export default function JobPostPage() {
  const [coinsAnim, setCoinsAnim] = useState<any>(null)
  const [dividendsAnim, setDividendsAnim] = useState<any>(null)
  const [homeAnim, setHomeAnim] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [coins, dividends, home] = await Promise.all([
          fetch("/animation-json/coins.json").then(r => r.json()),
          fetch("/animation-json/dividens.json").then(r => r.json()),
          fetch("/animation-json/home.json").then(r => r.json()),
        ])
        setCoinsAnim(coins)
        setDividendsAnim(dividends)
        setHomeAnim(home)
      } catch (e) {
        console.error("Failed to load lottie files for drushim", e)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ed' }}>
      <NavigationBar />
      <div className="container mx-auto px-4 pt-32 py-8 max-w-6xl">
        {/* Page Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold font-staff text-center text-gray-800" style={{ marginTop: '120px', marginBottom: '24px' }}
          variants={SlidUpRight(0) as any}
          initial="hidden"
          animate="visible"
        >
          דרושים
        </motion.h1>

        {/* Lottie Icons Row */}
        <motion.div
          variants={SlidUpLeft(0.05) as any}
          initial="hidden"
          animate="visible"
          className="flex flex-nowrap items-center justify-center gap-6 md:gap-8 lg:justify-between lg:px-16 xl:px-24 mb-6"
        >
          <div className="shrink-0 flex items-center justify-center">
            {homeAnim && (
              <Lottie animationData={homeAnim} loop autoplay className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
            )}
          </div>
          <div className="shrink-0 flex items-center justify-center">
            {dividendsAnim && (
              <Lottie animationData={dividendsAnim} loop autoplay className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
            )}
          </div>
          <div className="shrink-0 flex items-center justify-center">
            {coinsAnim && (
              <Lottie animationData={coinsAnim} loop autoplay className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
            )}
          </div>
        </motion.div>

        {/* Centered content wrapper */}
        <motion.div
          className="flex flex-col items-center justify-center"
          variants={SlidUpLeft(0.1) as any}
          initial="hidden"
          animate="visible"
        >

          {/* Job Cards - עם מרכוז משופר */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
              { title: 'ספקים - שמעוניינים לתת יד ולתרום לסלי המזון.', type: 'משרה מלאה', location: 'צפון הארץ' },
              { title: 'ספקים - שמעוניינים לעשות הנחה משמעותית למזון ומוצרים שונים שיכולים להתאים לסלי המזון הקיימים.', type: 'משרה מלאה', location: 'מרכז, ת"א' },
              { title: 'מתנדבים - שרוצים לקחת חלק באריזת סלי המזון ובחלוקה.', type: 'משרה מלאה', location: 'מרכז, ת"א' },
              { title: 'צלמים שמעוניינים לצלם את פעילות העמותה.', type: 'משרה חלקית', location: 'מרכז, בני ברק/בית שמש' },
              { title: 'בעלי רכבים גדולים - שמעוניינים לעזור בשינוע סלי המזון.', type: 'משרה מלאה', location: 'מרכז, ת"א' },
              { title: 'מנהלת תוכן מדיה חברתית ופרסום העמותה, מנהלת קמפיינים לתרומות ברשת.', type: 'משרה חלקית', location: 'מרכז, ת"א' },
            ].map((job, i) => (
              <Card key={i} className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto rounded-xl shadow-md bg-[#f2f2e8] overflow-hidden">
                {/* Header */}
                <div className="bg-[#f4a282] px-3 py-2 sm:px-4 sm:py-3 rounded-t-xl h-20 sm:h-24 flex items-center justify-center">
                  <h3 className="text-center text-black font-bold font-staff text-sm sm:text-base md:text-lg leading-snug">
                    {job.title}
                  </h3>
                </div>
                {/* Body */}
                <div className="px-3 py-3 sm:px-4 sm:py-4 flex flex-col justify-end items-center h-20 sm:h-24">
                  <div className="flex justify-center w-full">
                    <Button asChild variant="outline" className="rounded-full px-6 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-[#fdf6ed] hover:bg-[#f5f1e8] text-black border-transparent">
                      <Link href="/contact-form">הגשת מועמדות</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            </div>
          </div>

          {/* Back to site */}
          <div className="flex justify-center">
            <Button asChild variant="outline" className="rounded-full px-8 py-6 text-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-[#f4a282] hover:bg-[#ec8d66] text-black border-transparent">
              <Link href="/">חזרה לאתר</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}