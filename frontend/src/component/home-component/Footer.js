"use client"
import React from "react";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b1d34] text-gray-300 pt-16 pb-10 relative overflow-hidden">
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Logo and Info */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            {/* Rawasy Logo */}
            <div className="w-56 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 border border-[#f1601f]/30">
              <img
                src="/rawasy.png"
                alt="Rawasy Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>

        
          </div>

          <p className="text-sm leading-relaxed">
            Delivering quality contracting and trading services across multiple
            sectors with precision, trust, and innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {["Home", "About", "Services", "Projects", "Sectors", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`/${link.toLowerCase() === "home" ? "" : link.toLowerCase()}`}
                  className="hover:text-[#f1601f] transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-[#f1601f] mt-1" />
              <span>Doha, Qatar</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-[#f1601f]" />
              <span>+974 1234 5678</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-[#f1601f]" />
              <span>info@rawasy.qa</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-[#f1601f] transition-all duration-300"
              >
                <Icon size={20} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-white font-semibold">RAWASY</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
