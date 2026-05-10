"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * A responsive navigation bar that integrates with the LanguageContext.
 * When the user chooses a language from the dropdown, the text in the
 * navigation is automatically translated. The dropdown lists six
 * languages (English, German, Arabic, French, Italian, Spanish). The
 * current language code is displayed on the selector button.
 */
export default function Navbar() {
  const { lang, changeLanguage, t } = useLanguage();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const languages = [
    { code: "EN", name: "English" },
    { code: "DE", name: "Deutsch" },
    { code: "AR", name: "العربية" },
    { code: "FR", name: "Français" },
    { code: "IT", name: "Italiano" },
    { code: "ES", name: "Español" },
  ];

  // Default language should be English if no language is saved.
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language");
    const validLang = languages.some((item) => item.code === savedLang);

    if (!savedLang || !validLang) {
      localStorage.setItem("preferred-language", "EN");
      changeLanguage("EN");

      const html = document.documentElement;
      html.lang = "EN";
      html.dir = "ltr";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    localStorage.setItem("preferred-language", code);

    const html = document.documentElement;
    html.lang = code;
    html.dir = code === "AR" ? "rtl" : "ltr";

    setOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-screen z-50">
      {/* Semi-transparent backdrop and border */}
      <div className="w-full bg-black/50 backdrop-blur-xl border-b border-[#D4AF37]/20">
        <div className="w-full md:max-w-7xl md:mx-auto px-3 sm:px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo and brand name */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <Image
              src="/curtains-logo.ico"
              alt="SKF Curtains Logo"
              width={50}
              height={50}
              className="object-contain transition duration-300 group-hover:scale-105 flex-shrink-0"
              priority
            />

            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-lg md:text-xl font-semibold tracking-wide bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] bg-clip-text text-transparent group-hover:brightness-110 transition duration-300 truncate">
                SKF Curtains
              </span>

              <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase truncate">
                {t("footer.tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-12">
            <PremiumLink href="/" active={isActive("/")}>
              {t("navbar.home")}
            </PremiumLink>

            <PremiumLink href="/collections" active={isActive("/collections")}>
              {t("navbar.collections")}
            </PremiumLink>

            <PremiumLink href="/quotation" active={isActive("/quotation")}>
              {t("navbar.contact")}
            </PremiumLink>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="px-6 py-2 rounded-full border border-[#D4AF37]/40 text-[#F5D76E] bg-black/40 backdrop-blur-md hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F5D76E] hover:text-black transition-all duration-300 font-semibold tracking-wide"
              >
                {lang || "EN"}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-black/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl overflow-hidden shadow-2xl">
                  {languages.map(({ code, name }) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`w-full text-left px-5 py-3 transition-all duration-300 ${
                        lang === code
                          ? "text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]"
                          : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F5D76E]"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setOpen(false);
            }}
            className="md:hidden text-[#D4AF37] text-2xl w-11 h-11 rounded-full border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md flex items-center justify-center flex-shrink-0"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Mobile Menu Modal - Full Width */}
        {mobileOpen && (
          <div className="md:hidden w-screen px-0 pb-0">
            <div className="w-screen bg-black/95 backdrop-blur-xl border-t border-[#D4AF37]/25 shadow-2xl overflow-hidden">
              <div className="p-3 space-y-2">
                <MobileLink
                  href="/"
                  active={isActive("/")}
                  onClick={closeMobileMenu}
                >
                  {t("navbar.home")}
                </MobileLink>

                <MobileLink
                  href="/collections"
                  active={isActive("/collections")}
                  onClick={closeMobileMenu}
                >
                  {t("navbar.collections")}
                </MobileLink>

                <MobileLink
                  href="/quotation"
                  active={isActive("/quotation")}
                  onClick={closeMobileMenu}
                >
                  {t("navbar.contact")}
                </MobileLink>
              </div>

              <div className="border-t border-[#D4AF37]/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Language
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {languages.map(({ code, name }) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        lang === code
                          ? "text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]"
                          : "text-gray-300 bg-white/5 border border-white/10 hover:text-black hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F5D76E]"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/**
 * A reusable link component that applies subtle hover effects and an
 * animated gradient underline. The children are translated by the
 * consumer component.
 */
function PremiumLink({ href, children, active = false }) {
  return (
    <Link href={href} className="group relative">
      <span
        className={`font-medium tracking-wide text-[15px] transition-all duration-300 ${
          active ? "text-[#F5D76E]" : "text-white group-hover:text-[#F5D76E]"
        }`}
      >
        {children}
      </span>

      <span
        className={`absolute left-0 -bottom-2 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8962E] transition-all duration-400 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />

      <span
        className={`absolute left-0 -bottom-2 h-[6px] bg-[#D4AF37]/30 blur-md transition-all duration-400 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

function MobileLink({ href, children, active = false, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
        active
          ? "text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] shadow-lg"
          : "text-white bg-white/5 hover:text-black hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F5D76E]"
      }`}
    >
      <span>{children}</span>
      {active && <span className="text-xs font-bold">ACTIVE</span>}
    </Link>
  );
}