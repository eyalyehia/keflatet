"use client"
import { Card } from "../components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import Script from "next/script"
import Reveal from "../components/Reveal"

export default function OrganizationStory() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const iconBounce = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf6ed" }}>
      <div className="px-6 mx-auto max-w-4xl">
        {/* Main Title */}
        <div
          className="mb-16 text-center"
        >
                                                                                       <Reveal as="h1"
               className="flex gap-3 justify-center items-baseline mb-4 text-4xl font-bold font-staff tracking-tighter text-center md:text-5xl"
               style={{ color: "#2a2b26" }}
               type="heading"
             >
               סיפור העמותה
               <motion.svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="40"
                 height="40"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="text-[#2a2b26]"
                 animate={{
                   rotateY: [0, 180, 0],
                   scale: [1, 1.2, 1],
                   rotateZ: [0, 5, -5, 0]
                 }}
                 transition={{
                   duration: 4,
                   repeat: Infinity,
                   ease: "easeInOut",
                   times: [0, 0.5, 1]
                 }}
               >
                 <path d="M12 7v14"/>
                 <path d="M16 12h2"/>
                 <path d="M16 8h2"/>
                 <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                 <path d="M6 12h2"/>
                 <path d="M6 8h2"/>
               </motion.svg>
            </Reveal>
          <motion.div
            className="mx-auto w-24 h-1 rounded-full"
            style={{ backgroundColor: "#f2a283" }}
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Why we named it "Fun to Give" */}
          <motion.div variants={fadeInUp}>
            <Card className="p-8 mb-12 border-0 shadow-lg" style={{ backgroundColor: "rgba(151, 202, 188, 0.1)" }}>
              <div className="text-center" dir="rtl">
                <Reveal as="h2" type="heading"
                  className="mb-6 text-3xl font-bold font-staff tracking-tighter"
                  style={{ color: "#2a2b26" }}
                >
                  למה קראנו לעמותה כיף לתת?
                </Reveal>
                <motion.div
                  className="space-y-4 text-lg leading-relaxed text-gray-800 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Reveal as="p" type="paragraph">אם ישאלו אותנו מה הדבר שאנחנו הכי אוהבים, נענה חד משמעית שלתת לאחר זה הדבר הכי כיף בעולם!</Reveal>
                  
                  {/* Lottie Animation */}
                  <div className="flex justify-center mt-6">
                    <Script
                      src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
                      strategy="afterInteractive"
                    />
                    <Reveal type="media" as="div" className="w-32 h-32 md:w-40 md:h-40">
                      <lottie-player
                        src="/animation-json/56.json"
                        background="transparent"
                        speed="1"
                        loop
                        autoplay
                        className="w-full h-full"
                        style={{ width: 'auto', height: 'auto' }}
                      ></lottie-player>
                    </Reveal>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Mission Statement - moved here */}
          <motion.div variants={fadeInUp}>
            <Card className="p-8 mb-12 border-0 shadow-lg" style={{ backgroundColor: "rgba(151, 202, 188, 0.1)" }}>
              <div className="text-center" dir="rtl">
                <Reveal as="h2" type="heading"
                  className="mb-6 text-3xl font-bold font-staff tracking-tighter"
                  style={{ color: "#2a2b26" }}
                >
                  "ואהבת לרעך כמוך"
                </Reveal>
                <motion.div
                  className="space-y-4 text-lg leading-relaxed text-gray-800 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Reveal as="p" type="paragraph">הוא עקרון בסיסי שעלינו ליישם בחיינו ולכן אנו פועלים במטרה להעניק עזרה לכל מי שזקוק לה.</Reveal>
                  <Reveal as="p" type="paragraph">
                    כיום, אנו מחלקים באופן קבוע סלי מזון עשירים למאות משפחות,<br />ושואפים להרחיב את החלוקה שלנו
                    לכמות גדולה יותר של משפחות.
                  </Reveal>
                  <Reveal as="p" type="paragraph">נשמח להיות שותפים אתכם בסיוע למשפחות במצוקה, ויחד נוכל להמשיך ולהפיץ שמחה ואהבה.</Reveal>
                  <Reveal as="p" type="paragraph" className="font-semibold font-staff">כל תרומה, קטנה או גדולה, תסייע לנו להמשיך את המפעל החשוב הזה.</Reveal>
                  
                  {/* Lottie Animation */}
                  <div className="flex justify-center mt-6">
                    <Reveal type="media" as="div" className="w-32 h-32 md:w-40 md:h-40">
                      <lottie-player
                        src="/animation-json/57.json"
                        background="transparent"
                        speed="1"
                        loop
                        autoplay
                        className="w-full h-full"
                        style={{ width: 'auto', height: 'auto' }}
                      ></lottie-player>
                    </Reveal>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Memorial Section */}
          <motion.div variants={fadeInUp} className="mb-16">
            <Reveal as="h2" type="heading"
               className="mb-8 text-2xl font-bold font-staff tracking-tighter text-center"
               style={{ color: "#2a2b26" }}
               dir="rtl"
             >
               העמותה הוקמה לזכרם של:
            </Reveal>

            <div className="grid gap-6 mt-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {/* Miriam Alimlich Memorial */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full"
              >
                <div
                  className="p-6 h-full border-2 rounded-3xl shadow-lg"
                  style={{
                    background: "#fef7f1",
                    border: "2px solid #f5a383"
                  }}
                >
                  <div className="flex flex-col items-center text-center h-full" dir="rtl">
                    <Reveal type="media" as="div" className="mb-4 w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src="/pictures/מרים-אלימלך.webp"
                        alt="מרים אלימלך ז״ל"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </Reveal>
                    <Reveal as="p" type="paragraph"
                      className="text-sm leading-relaxed text-gray-800 px-2"
                    >
                      <strong>מרים אלימלך ז"ל</strong><br />
                      שהקדישה את חייה לגידול ילדיה ושמשה כוח עזר בבית החולים סורוקה במסירות רבה ואהבת אדם.
                    </Reveal>
                  </div>
                </div>
              </motion.div>

              {/* Yosef and Masuda Kanfo Memorial */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full"
              >
                <div
                  className="p-6 h-full border-2 rounded-3xl shadow-lg"
                  style={{
                    background: "#fef7f1",
                    border: "2px solid #f5a383"
                  }}
                >
                  <div className="flex flex-col items-center text-center h-full" dir="rtl">
                    <Reveal type="media" as="div" className="mb-4 w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src="/pictures/יוסף.webp"
                        alt="יוסף ומסעודה כנפו ז״ל"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </Reveal>
                    <Reveal as="p" type="paragraph"
                      className="text-sm leading-relaxed text-gray-800 px-2"
                    >
                      <strong>יוסף ומסעודה כנפו ז"ל</strong><br/>  שהקדישו את חייהם לגידול 14 ילדים, שאותם הם חינכו לערכים של אהבת הזולת ואהבת הארץ.
                    </Reveal>
                  </div>
                </div>
              </motion.div>

              {/* Professor Yaakov Zvisky Memorial */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="w-full"
              >
                <div
                  className="p-6 h-full border-2 rounded-3xl shadow-lg"
                  style={{
                    background: "#fef7f1",
                    border: "2px solid #f5a383"
                  }}
                >
                  <div className="flex flex-col items-center text-center h-full" dir="rtl">
                    <Reveal type="media" as="div" className="mb-4 w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src="/pictures/פרופסור.webp"
                        alt="פרופסור יעקב זביצקי ז״ל"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </Reveal>
                    <Reveal as="p" type="paragraph"
                      className="text-sm leading-relaxed text-gray-800 px-2"
                    >
                      <strong>פרופסור יעקב זביצקי ז"ל</strong><br/> ששירת את ישראל בכבוד ונתן בסתר לנצרכים ביחד עם אשתו יהודית תבדל"א.
                    </Reveal>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* Call to Action Button */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 text-center"
          >
            <motion.button
              className="px-8 py-4 text-lg font-bold font-staff text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f2a283 0%, #97cabc 100%)"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={() => {
                try {
                  const el = typeof document !== 'undefined' ? document.getElementById('תרומה') : null;
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else if (typeof window !== 'undefined') {
                    window.location.href = '/#תרומה';
                  }
                } catch {}
              }}
            >
              <div className="flex gap-3 justify-center items-center" dir="rtl">
                <span>הצטרפו לנתינה</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </motion.button>
            <motion.p
              className="mt-3 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              התרומה מאובטחת ומוגנת בהצפנה מתקדמת
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
