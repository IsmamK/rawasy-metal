import Navbar from '@/components/Navbar'
import './globals.css'
import LuxuryFooter from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext';

// import Navbar from './components/Navbar'
// import Footer from './components/Footer'



export const metadata = {
  title: 'CurtainCo - Luxury Curtains & Window Treatments',
  description:
    'Premium designer curtains for modern interiors. Custom designs, professional installation, and exceptional quality.',
  keywords:
    'curtains, window treatments, luxury curtains, custom curtains, home decor',
  icons: {
    icon: '/curtains-logo.png',
    shortcut: '/curtains-logo.png',
    apple: '/curtains-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-sans bg-lightBg text-textDark`}>
        <div className="min-h-screen flex flex-col">
          <LanguageProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <LuxuryFooter />
          </LanguageProvider>
        </div>
        
        {/* Global Script for Language */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedLang = localStorage.getItem('preferred-language');
                  if (savedLang) {
                    document.documentElement.lang = savedLang;
                    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </body>
    </html>
  )
}