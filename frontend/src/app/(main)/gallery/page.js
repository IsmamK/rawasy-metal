"use client"
import React, { useState, useEffect } from 'react';
import { 
  Building2, Factory, HardHat, Wrench, Package, Settings, 
  Filter, Search, X, ZoomIn, ChevronLeft, ChevronRight, 
  Download, Share2, Calendar, MapPin, Users, Award,
  Sparkles, ArrowRight, ChevronDown, CheckCircle
} from 'lucide-react';
import Gallery from '@/component/GalleryComponent/Gallery';
import Home from '@/component/GalleryComponent/Home';
import Process from '@/component/GalleryComponent/Process';
import CallToAction from '@/component/home-component/CallToAction';

const GalleryPage = () => {
 
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Home />
      
      <Gallery />
    
      {/* Process Section */}
      <Process />

      {/* Image Modal */}
      

      {/* Call to Action */}
      <CallToAction />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for modal */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #f1601f;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #d95417;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;