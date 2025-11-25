"use client"

import { ContactForm } from "../pages/Contact-form"
import { motion } from "framer-motion"
import { SlidUpRight } from "../lib/utils"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"
import NavigationBar from "../pages/Navbar"

export default function ContactFormPage() {
  const router = useRouter()

  const handleBackToSite = () => {
    router.push("/")
  }
  // 

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ed' }}>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="w-full max-w-2xl">
        <motion.div
          variants={SlidUpRight(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ backgroundColor: '#f2f2e8' }}
        >
          <ContactForm />
        </motion.div>
        
        {/* Back to Site Button - Outside the form frame */}
        <motion.div
          variants={SlidUpRight(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleBackToSite}
            className="bg-[#f4a282] hover:bg-[#ec8d66] text-white px-8 py-3 rounded-full text-lg font-medium font-staff cursor-pointer"
          >
            חזרה לאתר
          </Button>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
