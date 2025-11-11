"use client"
import React, { useState } from 'react';
import { 
  FileText, Building2, Users, Wrench, Package, Factory, Settings,
  CheckCircle, ArrowRight, Calendar, DollarSign, Clock, Target,
  Upload, Phone, Mail, MapPin, Award, Shield, Zap, Sparkles,
  Briefcase, HardHat, AlertCircle
} from 'lucide-react';
import Hero from '@/component/Qoute-component/Hero';
import QouteForm from '@/component/Qoute-component/QouteForm';
import Why_Choose_us from '@/component/Qoute-component/Why_Choose_us';
import Services from '@/component/Qoute-component/Services';
import Testimonial from '@/component/Qoute-component/Testimonial';
import FAQ from '@/component/Qoute-component/FAQ';
import FinalCTA from '@/component/Qoute-component/FinalCTA';

const GetQuotePage = () => {
  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Main Quote Form */}
      <QouteForm />

      {/* Why Choose Section */}
      <Why_Choose_us />

      {/* Services Overview */}
      <Services />

      {/* Testimonials */}
      <Testimonial />

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA />

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

export default GetQuotePage;