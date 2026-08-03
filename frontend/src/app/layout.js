import Script from 'next/script'
import Navbar from '@/components/Navbar'
import './globals.css'
import LuxuryFooter from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { getServerContent } from '@/lib/serverContent';
import {
  BUSINESS,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  businessJsonLd,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  jsonLd,
} from '@/lib/seo';

// import Navbar from './components/Navbar'
// import Footer from './components/Footer'



export const metadata = {
  // Lets every page express its canonical/OG URLs as plain paths.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Luxury Curtains & Window Treatments`,
    // Pages supply just their own name; the brand is appended here.
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  // No default canonical: each route sets its own via buildMetadata, and
  // inheriting "/" would point every unset page at the homepage.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Luxury Curtains & Window Treatments`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    // No `images` here: `app/opengraph-image.js` supplies the card for every
    // route, and an explicit value would override it.
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Luxury Curtains & Window Treatments`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/curtains-logo.png',
    shortcut: '/curtains-logo.png',
    apple: '/curtains-logo.png',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl('/curtains-logo.png'),
      description: DEFAULT_DESCRIPTION,
      telephone: BUSINESS.telephone,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS.telephone,
        contactType: 'sales',
        availableLanguage: ['en', 'ar'],
      },
    },
    businessJsonLd(),
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default async function RootLayout({ children }) {
  // The footer is CMS-driven and appears on every route, so seeding it here
  // keeps its links and contact details in the served HTML.
  const footerContent = await getServerContent('layout/footer/');

  return (
    <html lang="en" suppressHydrationWarning style={{ "--navbar-h": "84px" }}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KTH3B9NB');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={` font-sans bg-lightBg text-textDark`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KTH3B9NB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }}
        />

        <div className="min-h-screen flex flex-col">
          <AuthProvider>
          <LanguageProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <LuxuryFooter initialContent={footerContent} />
          </LanguageProvider>
          </AuthProvider>
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