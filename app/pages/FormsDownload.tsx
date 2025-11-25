"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SlidUpLeft } from '../lib/utils';
import Card from '../ui/Card';
import Lottie from 'lottie-react';
import NavigationBar from './Navbar';

const FormsDownload: React.FC = () => {
  const [registrationAnim, setRegistrationAnim] = useState<any>(null);
  const [generateInitialAnim, setGenerateInitialAnim] = useState<any>(null);
  const [writingExamAnim, setWritingExamAnim] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load animations from public
    const load = async () => {
      try {
        const [a, b, c] = await Promise.all([
          fetch('/animation-json/form%20registration.json').then(r => r.json()),
          fetch('/animation-json/Generate-Initial.json').then(r => r.json()),
          fetch('/animation-json/Writing%20an%20exam.json').then(r => r.json()),
        ]);
        setRegistrationAnim(a);
        setGenerateInitialAnim(b);
        setWritingExamAnim(c);
      } catch (e) {
        // Fail silently; page continues without icons
        console.warn('Failed to load lottie icons', e);
      }
    };
    load();
  }, []);

  const formsData = [
    {
      title: "תעודת רישום עמותה",
      imageSrc: "/טפסים/תעודת רישום עמותה.png",
      imageAlt: "תעודת רישום עמותה",
      pdfPath: "/טפסים/תעודת רישום עמותה.png",
      downloadName: "תעודת רישום עמותה.png"
    },
    {
      title: "אישור מוסד ציבורי לעניין תרומות (טופס 46)",
      imageSrc: "/טפסים/טופס 46.png",
      imageAlt: "אישור מוסד ציבורי לעניין תרומות",
      pdfPath: "/טפסים/טופס 46.png",
      downloadName: "טופס 46.png"
    },
    {
      title: "אישור ניהול תקין לשנת 2025",
      imageSrc: "/טפסים/אישור הגשת מסמכים.png",
      imageAlt: "אישור ניהול תקין",
      pdfPath: "/טפסים/אישור הגשת מסמכים.png",
      downloadName: "אישור הגשת מסמכים.png"
    },
    {
      title: "אישור ניכוי מס במקור",
      imageSrc: "/טפסים/ניכוי מס.png",
      imageAlt: "אישור ניכוי מס במקור",
      pdfPath: "/טפסים/ניכוי מס.png",
      downloadName: "ניכוי מס.png"
    }
  ];

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#fdf6ed' }}>
      <NavigationBar />
      <div className="container px-4 pt-32 py-12 mx-auto">
        <motion.h1
          className="mb-4 md:mb-6 text-4xl font-bold font-staff text-center text-gray-800" style={{ marginTop: '120px' }}
          variants={SlidUpLeft(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          טפסים רשמיים של העמותה </motion.h1>
        
        {/* Icons row under the title */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-10 md:mt-14 mb-10">
          {registrationAnim && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <Lottie animationData={registrationAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          {generateInitialAnim && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <Lottie animationData={generateInitialAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          {writingExamAnim && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <Lottie animationData={writingExamAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
            </div>
          )}
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4" style={{ marginTop: '90px' }}>
          {formsData.map((form, index) => (
            <div key={index} className="flex flex-col h-full">
              {/* כותרת הטופס - מחוץ למסגרת */}
              <motion.h3
                className="text-xl font-bold font-staff text-gray-800 text-center h-16 flex items-center justify-center"
                style={{ marginBottom: '20px' }}
                variants={SlidUpLeft(0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {form.title}
              </motion.h3>

              {/* הטופס במסגרת */}
              <div className="flex-1 flex flex-col">
                <Card>
                  <motion.div
                    className="text-center bg-white rounded-lg shadow-lg flex flex-col h-full p-0 cursor-pointer"
                    variants={SlidUpLeft(0.05)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    onClick={() => {
                      setSelectedForm(form);
                      setIsModalOpen(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="relative w-full h-80 mx-auto"
                      variants={SlidUpLeft(0.15)}
                    >
                      <Image
                        src={form.imageSrc}
                        alt={form.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="rounded-lg shadow-md object-contain object-center"
                      />
                    </motion.div>
                  </motion.div>
                </Card>

                {/* כפתור צפייה - מחוץ למסגרת */}
                <motion.button
                  onClick={() => {
                    setSelectedForm(form);
                    setIsModalOpen(true);
                  }}
                  className="block text-center px-4 py-3 bg-white border-2 border-[#f5a383] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer mt-4 w-full"
                  style={{ color: '#f5a383' }}
                  variants={SlidUpLeft(0.1)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  לצפייה בתעודה לחץ על הטופס
                </motion.button>
              </div>
            </div>
          ))}
        </div>
        
        {/* כפתור חזרה לאתר */}
        <motion.div
          className="mt-12 text-center"
          variants={SlidUpLeft(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Link href="/">
            <button className="px-8 py-3 bg-[#f5a383] text-white font-semibold font-staff rounded-lg hover:bg-[#e0ccbc] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
              חזרה לאתר
            </button>
          </Link>
        </motion.div>
        
        {/* מרווח נוסף בתחתית */}
        <div className="h-20 md:h-32 lg:h-40"></div>
      </div>

      {/* Modal for displaying form */}
      {isModalOpen && selectedForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ backgroundColor: '#fdf6ed' }}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-auto"
            style={{ marginTop: '64px' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold font-staff text-gray-800 text-center">{selectedForm.title}</h3>
              <button
                aria-label="סגירת חלון"
                onClick={() => setIsModalOpen(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] mb-6">
                <Image
                  src={selectedForm.imageSrc}
                  alt={selectedForm.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 800px, 1000px"
                  className="object-contain"
                />
              </div>

              {/* Download Button */}
              <motion.button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedForm.pdfPath;
                  link.download = selectedForm.downloadName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-6 py-2 bg-[#f5a383] text-white font-semibold font-staff rounded-lg hover:bg-[#e0ccbc] transition-all duration-300 shadow-lg hover:shadow-xl mb-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                להורדה
              </motion.button>

              {/* Close Button */}
              <div>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold font-staff rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕ סגירה
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FormsDownload;