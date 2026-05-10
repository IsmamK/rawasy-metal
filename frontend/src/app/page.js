'use client'

import AboutFeatures from '@/components/Home/AboutFeatures'
import CollectionsSection from '@/components/Home/CollectionsSection'
import CurtainHelpSection from '@/components/Home/CurtainHelpSection'
import FeaturedProductsSection from '@/components/Home/FeaturedProductsSection'
import Hero from '@/components/Home/Hero'
import { useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function Home() {

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang) {
      const html = document.documentElement
      html.lang = savedLang
      html.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
    }
  }, [])

  // ✅ WhatsApp number (NO spaces, NO +)
  const whatsappNumber = "971547219791"

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello, I would like to know more about your curtain collections."
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  return (
    <div
      className="bg-lightBg relative min-h-screen bg-cover bg-fixed bg-no-repeat"
      style={{
        backgroundImage: "url('/curtains-background.png')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Sections */}
      <Hero />
      <AboutFeatures />
      <CollectionsSection />
      <FeaturedProductsSection />
      <CurtainHelpSection />

      {/* ✅ Floating WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="
          fixed bottom-6 right-6 z-50
          w-16 h-16
          rounded-full
          bg-[#25D366]
          text-white
          flex items-center justify-center
          shadow-2xl
          hover:scale-110
          hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)]
          transition-all duration-300
          animate-bounce
        "
      >
        <FaWhatsapp size={28} />
      </button>

    </div>
  )
}