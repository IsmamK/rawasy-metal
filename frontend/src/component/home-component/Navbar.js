"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Services', 'Projects', 'Gallery', 'Sectors', 'Contact'];

  const getHref = (item) => {
    if (item === 'Home') return '/';
    return `/${item.toLowerCase()}`;
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-2xl py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* ✅ Logo Section */}
          <a href="/" className="flex items-center space-x-3 group cursor-pointer ">
            <img
              src="/rawasy.png"
              alt="Rawasy Logo"
              className="bg-black rounded-lg w-36 h-12 p-1 object-contain transition-transform duration-300 group-hover:scale-105"
            />
        
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((item) => (
              <a
                key={item}
                href={getHref(item)}
                className={`relative font-semibold text-sm tracking-wide transition-all duration-300 group ${
                  isScrolled ? 'text-[#0b1d34]' : 'text-white'
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f1601f] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <a
              href="/quote"
              className="bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-6 py-3 rounded-lg font-bold text-sm hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
            {mobileMenuOpen ? (
              <X className={isScrolled ? 'text-[#0b1d34]' : 'text-white'} size={28} />
            ) : (
              <Menu className={isScrolled ? 'text-[#0b1d34]' : 'text-white'} size={28} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-6 bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            {navLinks.map((item) => (
              <a
                key={item}
                href={getHref(item)}
                className="block py-3 text-[#0b1d34] hover:text-[#f1601f] font-semibold text-lg border-b border-gray-100 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
