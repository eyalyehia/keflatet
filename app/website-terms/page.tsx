"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NavigationBar from "../pages/Navbar"

export default function WebsiteTerms() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-br from-[#fdf6ed] via-white to-[#f0f9ff] pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#2a2b26] font-staff mb-4">
            תקנון האתר ומדיניות פרטיות
          </h1>
          <p className="text-lg text-gray-600">עמותת "כיף לתת"</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eaf6f2] text-[#2a2b26] font-staff font-bold">
            מס' עמותה: <span className="text-[#5fb3a3]">580772994</span>
          </div>
          <Link 
            href="/#תרומה"
            className="inline-flex items-center gap-2 mt-6 text-[#5fb3a3] hover:text-[#4a9d8e] font-medium transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לדף התרומות
          </Link>
        </motion.div>

        {/* Terms Content */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#2a2b26] font-staff mb-6 border-b-2 border-[#9dd0bf] pb-2">
            תקנון אתר – עמותת "כיף לתת"
          </h2>
          <p className="text-sm text-gray-500 mb-6">עודכן לאחרונה: ספטמבר 2025</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">1. הגדרות</h3>
              <div className="space-y-2">
                <p><strong>"האתר"</strong> – keflatet.com</p>
                <p><strong>"העמותה"</strong> – עמותת כיף לתת, ח"פ/מס׳ עמותה: 580772994</p>
                <p><strong>"משתמש/ת"</strong> – כל גולש/ת באתר.</p>
                <p><strong>"תרומה"</strong> – כל העברה כספית לעמותה דרך האתר או קישור חיצוני.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">2. הסכמה לתנאים</h3>
              <p>השימוש באתר מהווה הסכמה מלאה ובלתי מסויגת לתקנון זה ולמדיניות הפרטיות.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">3. מטרת האתר</h3>
              <p>האתר מציג מידע על פעילות העמותה ומאפשר ביצוע תרומות באמצעי תשלום שונים.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">4. תרומות ותשלומים</h3>
              <div className="space-y-2">
                <p><strong>4.1</strong> ניתן לבצע תרומה חד-פעמית או חודשית.</p>
                <p><strong>4.2</strong> סליקה עשויה להתבצע באמצעות ספקים חיצוניים (כגון Bit/נדרים פלוס/חברת אשראי). החיוב כפוף לתנאי הספק.</p>
                <p><strong>4.3</strong> לאחר השלמת תרומה תישלח אסמכתא לכתובת המייל שנמסרה.</p>
                <p><strong>4.4</strong> אם לעמותה יש אישור לפי סעיף 46 לפקודת מס הכנסה – יונפק אישור תרומה מתאים. אם לא – תישלח קבלה רגילה.</p>
                <p><strong>4.5</strong> בתרומות חודשיות: החיוב יימשך עד לביטול יזום שלך בהתאם לסעיף 5.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">5. ביטול תרומה וזיכוי</h3>
              <div className="space-y-2">
                <p><strong>5.1</strong> תרומה חד-פעמית: ניתן לבקש ביטול וזיכוי בתוך 14 ימים ממועד התרומה, כל עוד הכסף לא הוקצה ספציפית למטרה ייעודית שלא ניתנת להשבה.</p>
                <p><strong>5.2</strong> תרומה חודשית: ניתן לבטל בכל עת, והביטול יחול מהחיוב הבא. חיובים שבוצעו לא יוחזרו, אלא אם נפלה טעות.</p>
                <p><strong>5.3</strong> בקשות ביטול יש לשלוח לכתובת: <a href="mailto:keflatet@gmail.com" className="text-[#5fb3a3] hover:underline">keflatet@gmail.com</a> בצירוף שם מלא, תאריך התרומה, סכום ואסמכתא.</p>
                <p><strong>5.4</strong> מענה יימסר בתוך מספר ימי עסקים סביר.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">6. שימוש מותר באתר</h3>
              <p>אין להשתמש באתר לשום מטרה בלתי חוקית או הפוגעת בעמותה, בגולשים אחרים או בצדדים שלישיים.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">7. תוכן וקניין רוחני</h3>
              <p>כל זכויות היוצרים והקניין הרוחני באתר שייכות לעמותה או לבעלי הזכויות הרלוונטיים.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">8. קישורים ושירותי צד שלישי</h3>
              <p>העמותה אינה אחראית למדיניות או לאבטחת ספקי שירות חיצוניים (כגון מערכות סליקה).</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">9. גילוי נאות</h3>
              <p>המידע באתר הוא כללי בלבד ואינו מהווה ייעוץ משפטי/פיננסי.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">10. הגבלת אחריות</h3>
              <p>העמותה לא תישא באחריות לכל נזק עקיף או תוצאתי כתוצאה משימוש באתר או בשירותים חיצוניים.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">11. שיפוי</h3>
              <p>המשתמש/ת מתחייב/ת לשפות את העמותה בגין כל נזק או הוצאה שנגרמו עקב הפרת התקנון.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">12. אבטחה</h3>
              <p>העמותה נוקטת באמצעי אבטחה סבירים אך אינה יכולה להבטיח חסינות מוחלטת מפני פריצות.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">13. נגישות</h3>
              <p>העמותה פועלת להנגשת האתר. לפניות בנושא נגישות ניתן ליצור קשר עם יהונתן בכתובת <a href="mailto:keflatet@gmail.com" className="text-[#5fb3a3] hover:underline">keflatet@gmail.com</a>.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">14. פניות</h3>
              <div className="space-y-1">
                <p><strong>איש קשר:</strong> יהונתן</p>
                <p><strong>דוא״ל:</strong> <a href="mailto:keflatet@gmail.com" className="text-[#5fb3a3] hover:underline">keflatet@gmail.com</a></p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">15. שינויי תקנון</h3>
              <p>העמותה רשאית לעדכן את התקנון מעת לעת. גרסה מעודכנת תפורסם באתר.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">16. דין וסמכות שיפוט</h3>
              <p>יחולו דיני מדינת ישראל. סמכות השיפוט הבלעדית נתונה לבתי המשפט בירושלים.</p>
            </section>
          </div>
        </motion.div>

        {/* Privacy Policy */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#2a2b26] font-staff mb-6 border-b-2 border-[#9dd0bf] pb-2">
            מדיניות פרטיות – עמותת "כיף לתת"
          </h2>
          <p className="text-sm text-gray-500 mb-6">עודכן לאחרונה: ספטמבר 2025</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">1. מידע שנאסף</h3>
              <div className="space-y-2">
                <p>• פרטי זיהוי ומגע שמסרת (שם, מייל, טלפון).</p>
                <p>• פרטי תרומה (סכום, מועד, אמצעי תשלום – כפי שמוחזקים אצל ספק הסליקה).</p>
                <p>• נתוני שימוש באתר (IP, דפדפן, עוגיות).</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">2. מטרות השימוש</h3>
              <div className="space-y-2">
                <p>• עיבוד תרומות והנפקת קבלות.</p>
                <p>• מתן שירות ותמיכה.</p>
                <p>• תפעול ושיפור האתר.</p>
                <p>• שליחת עדכונים בהסכמה.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">3. העברת מידע לצד שלישי</h3>
              <div className="space-y-2">
                <p>• לספקי שירות חיצוניים (סליקה, אירוח, תחזוקה) לפי הצורך.</p>
                <p>• לרשויות, אם נידרש על פי חוק.</p>
                <p>• לא נמסור מידע מסחרי לצד שלישי ללא הסכמה.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">4. אבטחת מידע</h3>
              <p>נוקטים באמצעי אבטחה סבירים; יחד עם זאת אין הגנה מוחלטת.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">5. זכויותיך</h3>
              <p>ניתן לבקש עיון, תיקון או מחיקה של מידע אישי באמצעות פנייה לכתובת <a href="mailto:keflatet@gmail.com" className="text-[#5fb3a3] hover:underline">keflatet@gmail.com</a>.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">6. עוגיות</h3>
              <p>האתר משתמש בעוגיות לתפעול ומדידה. ניתן לחסום אותן בדפדפן.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">7. עדכונים</h3>
              <p>העמותה רשאית לעדכן את מדיניות הפרטיות. גרסה עדכנית תפורסם באתר.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-[#2a2b26] mb-3">8. יצירת קשר</h3>
              <div className="space-y-1">
                <p><strong>לענייני פרטיות:</strong></p>
                <p><strong>איש קשר:</strong> יהונתן</p>
                <p><strong>דוא״ל:</strong> <a href="mailto:keflatet@gmail.com" className="text-[#5fb3a3] hover:underline">keflatet@gmail.com</a></p>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Back to top button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            href="/#תרומה"
            className="inline-flex items-center gap-2 bg-[#5fb3a3] hover:bg-[#4a9d8e] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לדף התרומות
          </Link>
        </motion.div>
      </div>
    </div>
    </>
  )
}
