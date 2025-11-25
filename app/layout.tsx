import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import "./fonts/almoni.css";
import "./fonts/quicksand.css";
import { VideoProvider } from "./contexts/VideoContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "כיף לתת - עמותה למען משפחות נזקקות | תרומה וצדקה",
  description: "עמותת כיף לתת מעניקה בשר, עופות, דגים, ביצים ויין למאות משפחות נזקקות באופן קבוע. עוזרת לילדים עם מוגבלויות ומשמחת ילדים בבתי חולים. כל הפעילות נעשית על ידי מתנדבים ללא מקבלי שכר. תרמו עכשיו ועזרו לנו להמשיך את הנתינה והערבות ההדדית בישראל.",
  keywords: "כיף לתת, עמותה, תרומה, צדקה, עזרה למשפחות, מתנדבים, ישראל, בשר, עופות, דגים, עזרה לנזקקים, ילדים, בתי חולים, מוגבלויות, ערבות הדדית",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  // Ensure browsers do not auto-apply dark mode
  themeColor: "#fdf6ed",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://www.keflatet.com',
    title: 'כיף לתת - עמותה למען משפחות נזקקות',
    description: 'עמותת כיף לתת מעניקה בשר, עופות, דגים, ביצים ויין למאות משפחות נזקקות באופן קבוע. עוזרת לילדים עם מוגבלויות ומשמחת ילדים בבתי חולים.',
    siteName: 'כיף לתת',
    images: [
      {
        url: 'https://www.keflatet.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'כיף לתת - עמותה למען משפחות נזקקות',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'כיף לתת - עמותה למען משפחות נזקקות',
    description: 'עמותת כיף לתת מעניקה בשר, עופות, דגים, ביצים ויין למאות משפחות נזקקות באופן קבוע.',
    images: ['https://www.keflatet.com/logo.png'],
  },
  alternates: {
    canonical: 'https://www.keflatet.com',
  },
  other: {
    "color-scheme": "light",
    // Older iOS/Safari hint
    "supported-color-schemes": "light",
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

// WhatsApp Icon Component
function WhatsAppIcon() {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <a
        href="https://wa.me/972532217895"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-14 h-14 transition-all duration-300 ease-in-out group hover:scale-110 hover:rotate-12 active:scale-95"
        aria-label="צור קשר דרך WhatsApp"
      >
        <svg
          className="w-full h-full transition-colors duration-300 whatsapp-icon"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 22.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z" fill="#f5a383"/>
          <path d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" fill="#f5a383"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z" fill="white"/>
          <path d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z" fill="white"/>
        </svg>
      </a>
    </div>
  );
}

// Email Icon Component
function EmailIcon() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a
        href="/contact-form"
        className="block w-14 h-14 transition-all duration-300 ease-in-out group hover:scale-110 hover:rotate-12 active:scale-95"
        aria-label="שלח אימייל"
      >
        <svg
          className="w-full h-full transition-colors duration-300 email-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#f5a383"/>
        </svg>
      </a>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
      </head>
      <body
        className={`${playfair.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <VideoProvider>
          {children}
          <WhatsAppIcon />
          <EmailIcon />
        </VideoProvider>
      </body>
    </html>
  );
}
