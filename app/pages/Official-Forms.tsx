'use client';

import React from 'react';
import Image from 'next/image';

const OfficialForms = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ed' }}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold font-staff text-center mb-12 text-gray-800">
          טפסים רשמיים
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* תעודת רישום עמותה */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold font-staff mb-4 text-gray-800">
              תעודת רישום עמותה
            </h2>
            <div className="mb-4 relative">
              <Image
                src="/טפסים/תעודת רישום עמותה.pdf"
                alt="תעודת רישום עמותה"
                width={300}
                height={400}
                className="mx-auto rounded-lg shadow-md"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-2">
              <a
                href="/טפסים/תעודת רישום עמותה.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline cursor-pointer"
                style={{ color: '#f5a383' }}
              >
                לצפייה בתעודה לחץ כאן
              </a>
              <a
                href="https://www.guidestar.org.il"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline cursor-pointer"
                style={{ color: '#9acdbe' }}
              >
                צפייה בדף העמותה באתר גיידסטאר
              </a>
            </div>
          </div>

          {/* אישור מוסד ציבורי לעניין תרומות */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold font-staff mb-4 text-gray-800">
              אישור מוסד ציבורי לעניין תרומות (טופס 46)
            </h2>
            <div className="mb-4 relative">
              <Image
                src="/טפסים/טופס 46.png"
                alt="אישור מוסד ציבורי לעניין תרומות"
                width={300}
                height={400}
                className="mx-auto rounded-lg shadow-md"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-2">
              <a
                href="/טפסים/טופס 46.png"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline cursor-pointer"
                style={{ color: '#f5a383' }}
              >
                לצפייה בתעודה לחץ כאן
              </a>
            </div>
          </div>

          {/* אישור ניהול תקין */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-bold font-staff mb-4 text-gray-800">
              אישור ניהול תקין לשנת 2025
            </h2>
            <div className="mb-4 relative">
              <Image
                src="/טפסים/אישור הגשת מסמכים.png"
                alt="אישור ניהול תקין"
                width={300}
                height={400}
                className="mx-auto rounded-lg shadow-md"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-2">
              <a
                href="/טפסים/אישור הגשת מסמכים.png"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline cursor-pointer"
                style={{ color: '#f5a383' }}
              >
                לצפייה בתעודה לחץ כאן
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialForms;
