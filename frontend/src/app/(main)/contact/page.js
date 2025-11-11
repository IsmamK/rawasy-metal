"use client"
import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Globe, Send, CheckCircle, 
  Building2, Users, Award, Shield, ArrowRight, Linkedin,
  Facebook, Twitter, Instagram, MessageSquare, Headphones,
  FileText, Calendar, Zap
} from 'lucide-react';
import Hero from '@/component/Contact-component/Hero';
import Contact from '@/component/Contact-component/Contact';
import Department from '@/component/Contact-component/Department';
import FAQ from '@/component/Contact-component/FAQ';

const ContactPage = () => {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Contact Info Cards */}
      

      {/* Main Contact Section */}
      <Contact />

      {/* Departments */}
      
      <Department />
      {/* FAQ Section */}
      <FAQ />

     

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;