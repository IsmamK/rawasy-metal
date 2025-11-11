"use client"
import React, { useState, useEffect } from 'react';
import { Building2, Factory, Droplets, Zap, Home, Hospital, ArrowRight, Filter, Search, MapPin, Calendar, Users, Award, CheckCircle, TrendingUp, ChevronDown, ChevronRight, X } from 'lucide-react';
import Hero from '@/component/Project-components/Hero';
import Projects from '@/component/Project-components/Projects';
import CallToAction from '@/component/home-component/CallToAction';

const RawasyProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Projects', icon: Building2, count: 800 },
    { id: 'oil-gas', name: 'Oil & Gas', icon: Droplets, count: 150 },
    { id: 'infrastructure', name: 'Infrastructure', icon: TrendingUp, count: 200 },
    { id: 'commercial', name: 'Commercial', icon: Building2, count: 250 },
    { id: 'industrial', name: 'Industrial', icon: Factory, count: 180 },
    { id: 'residential', name: 'Residential', icon: Home, count: 120 },
    { id: 'healthcare', name: 'Healthcare', icon: Hospital, count: 90 }
  ];

  const projects = [
    {
      id: 1,
      title: "Al Ruwais Refinery Expansion",
      category: 'oil-gas',
      location: "Abu Dhabi, UAE",
      year: "2022-2023",
      client: "ADNOC",
      value: "$45M",
      duration: "18 months",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=800&fit=crop",
      description: "Major expansion project for crude oil processing facility including new storage tanks, pipeline networks, and advanced safety systems.",
      scope: ["Civil & Structural Works", "MEP Installation", "Process Equipment", "Safety Systems"],
      challenges: "Working in operational refinery environment with strict safety protocols",
      solution: "Implemented phased execution with zero downtime to existing operations",
      results: ["Increased capacity by 30%", "Zero safety incidents", "Completed 2 weeks ahead of schedule"]
    },
    {
      id: 2,
      title: "Sheikh Zayed Highway Bridge",
      category: 'infrastructure',
      location: "Dubai, UAE",
      year: "2021-2023",
      client: "RTA Dubai",
      value: "$65M",
      duration: "24 months",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
      description: "Construction of 2.5km elevated highway bridge with 6 lanes, advanced drainage systems, and smart traffic management integration.",
      scope: ["Structural Engineering", "Bridge Construction", "Road Works", "Smart Systems Integration"],
      challenges: "Minimal disruption to existing traffic flow during construction",
      solution: "Night-time construction with modular bridge sections for rapid assembly",
      results: ["Reduced traffic congestion by 40%", "LEED Gold certified", "Enhanced urban connectivity"]
    },
    {
      id: 3,
      title: "Dubai Marina Commercial Tower",
      category: 'commercial',
      location: "Dubai, UAE",
      year: "2020-2022",
      client: "Emaar Properties",
      value: "$85M",
      duration: "30 months",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
      description: "45-story premium office tower with Grade A specifications, featuring smart building technologies and sustainable design elements.",
      scope: ["Complete Civil Works", "MEP Systems", "Facade Installation", "Interior Fit-out"],
      challenges: "Tight urban site with complex logistics and neighbor coordination",
      solution: "Vertical construction methodology with advanced crane systems",
      results: ["100% occupancy within 6 months", "LEED Platinum certified", "Award-winning design"]
    },
    {
      id: 4,
      title: "Industrial Manufacturing Complex",
      category: 'industrial',
      location: "Jebel Ali, Dubai",
      year: "2022-2023",
      client: "Gulf Industries Corp",
      value: "$55M",
      duration: "20 months",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
      description: "State-of-the-art manufacturing facility with automated systems, heavy-duty infrastructure, and comprehensive utility networks.",
      scope: ["Industrial Building Construction", "Heavy Equipment Installation", "Utility Infrastructure", "Fire Safety Systems"],
      challenges: "Specialized foundation requirements for heavy machinery",
      solution: "Advanced foundation engineering with vibration isolation systems",
      results: ["Production capacity exceeded targets", "Operational within 3 months", "Zero defects certification"]
    },
    {
      id: 5,
      title: "Palm Jumeirah Luxury Villas",
      category: 'residential',
      location: "Palm Jumeirah, Dubai",
      year: "2021-2022",
      client: "Nakheel",
      value: "$42M",
      duration: "16 months",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
      description: "Development of 25 ultra-luxury beachfront villas with private pools, smart home systems, and premium finishes.",
      scope: ["Villa Construction", "Landscaping", "MEP Systems", "Smart Home Integration"],
      challenges: "Coastal construction with marine environment considerations",
      solution: "Marine-grade materials and advanced waterproofing systems",
      results: ["100% sold pre-completion", "Premium pricing achieved", "Award for luxury development"]
    },
    {
      id: 6,
      title: "Modern Healthcare Center",
      category: 'healthcare',
      location: "Sharjah, UAE",
      year: "2022-2023",
      client: "Ministry of Health",
      value: "$38M",
      duration: "22 months",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop",
      description: "200-bed multi-specialty hospital with advanced medical equipment, operation theaters, and patient care facilities.",
      scope: ["Hospital Building Construction", "Medical Gas Systems", "HVAC & Clean Rooms", "Emergency Systems"],
      challenges: "Strict healthcare regulations and infection control requirements",
      solution: "Specialized healthcare construction protocols with sterile environments",
      results: ["JCI accreditation ready", "Energy efficient design", "Community healthcare improved"]
    },
    {
      id: 7,
      title: "Petrochemical Processing Plant",
      category: 'oil-gas',
      location: "Ruwais, Abu Dhabi",
      year: "2020-2022",
      client: "ADNOC Refining",
      value: "$95M",
      duration: "28 months",
      image: "https://images.unsplash.com/photo-1613843661100-3ec9e97a80bc?w=1200&h=800&fit=crop",
      description: "Advanced petrochemical processing facility with catalyst reactors, distillation columns, and comprehensive safety systems.",
      scope: ["Process Engineering", "Equipment Installation", "Piping Networks", "Control Systems"],
      challenges: "Complex process integration with existing facilities",
      solution: "Detailed 3D modeling and simulation before installation",
      results: ["Production efficiency increased 25%", "Zero environmental incidents", "Industry benchmark safety record"]
    },
    {
      id: 8,
      title: "Metro Station Development",
      category: 'infrastructure',
      location: "Riyadh, Saudi Arabia",
      year: "2021-2023",
      client: "Royal Commission for Riyadh",
      value: "$72M",
      duration: "26 months",
      image: "https://images.unsplash.com/photo-1594879583293-5c816b3f5627?w=1200&h=800&fit=crop",
      description: "Modern metro station complex with underground platforms, retail areas, and integrated transportation hub.",
      scope: ["Underground Construction", "Station Architecture", "MEP Systems", "Retail Fit-out"],
      challenges: "Complex underground utilities and water table management",
      solution: "Advanced dewatering and ground stabilization techniques",
      results: ["50,000 daily passenger capacity", "Architectural excellence award", "Regional connectivity enhanced"]
    },
    {
      id: 9,
      title: "Business Bay Office Complex",
      category: 'commercial',
      location: "Business Bay, Dubai",
      year: "2022-2024",
      client: "Meraas Holding",
      value: "$78M",
      duration: "32 months",
      image: "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=1200&h=800&fit=crop",
      description: "Twin tower office complex with 40 floors each, featuring sustainable design, smart building systems, and premium amenities.",
      scope: ["High-rise Construction", "Curtain Wall Systems", "MEP Integration", "Facility Management Setup"],
      challenges: "Coordination of twin tower construction with shared podium",
      solution: "Synchronized construction schedule with advanced project management",
      results: ["LEED Gold certified", "30% energy savings", "Premium tenant attraction"]
    },
    {
      id: 10,
      title: "Automotive Manufacturing Plant",
      category: 'industrial',
      location: "Khalifa Industrial Zone, Abu Dhabi",
      year: "2021-2023",
      client: "Emirates Advanced Investments",
      value: "$68M",
      duration: "24 months",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop",
      description: "Large-scale automotive assembly plant with robotic systems, paint shop, and comprehensive quality control facilities.",
      scope: ["Industrial Building", "Robotic Systems Installation", "Paint Shop Construction", "Quality Labs"],
      challenges: "Precision requirements for automated assembly lines",
      solution: "Laser-guided installation with millimeter accuracy",
      results: ["Annual capacity 50,000 units", "Industry 4.0 compliant", "Job creation: 800+ positions"]
    },
    {
      id: 11,
      title: "Waterfront Residential Community",
      category: 'residential',
      location: "Yas Island, Abu Dhabi",
      year: "2020-2022",
      client: "Aldar Properties",
      value: "$92M",
      duration: "28 months",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      description: "Exclusive waterfront community with 150 villas and townhouses, featuring marina access, clubhouse, and recreational facilities.",
      scope: ["Residential Construction", "Marina Development", "Landscaping", "Amenities Construction"],
      challenges: "Marine construction and erosion protection",
      solution: "Advanced marine engineering with sustainable coastal protection",
      results: ["Fastest selling development", "Community of the year award", "Sustainable living certification"]
    },
    {
      id: 12,
      title: "Specialized Medical Research Center",
      category: 'healthcare',
      location: "Dubai Healthcare City",
      year: "2022-2023",
      client: "Dubai Health Authority",
      value: "$48M",
      duration: "20 months",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=800&fit=crop",
      description: "Advanced medical research facility with specialized laboratories, clean rooms, and cutting-edge research equipment.",
      scope: ["Laboratory Construction", "Clean Room Systems", "HVAC Precision Control", "Research Equipment Installation"],
      challenges: "Extreme precision requirements for research environments",
      solution: "Pharmaceutical-grade construction standards with validation protocols",
      results: ["ISO Class 5 clean rooms", "International research partnerships", "Regional hub for medical innovation"]
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // const stats = [
  //   { label: "Total Projects", value: "800+", icon: Building2 },
  //   { label: "Active Projects", value: "45+", icon: TrendingUp },
  //   { label: "Total Value", value: "$2.5B+", icon: Award },
  //   { label: "Client Satisfaction", value: "100%", icon: CheckCircle }
  // ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34]">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-sm tracking-wider">OUR PORTFOLIO</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Projects That <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Define Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Showcasing 800+ successfully delivered projects across the Gulf region, setting benchmarks for quality and innovation.
            </p>
          </div>

          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <stat.icon className="text-[#f1601f] mb-4" size={32} />
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <Hero />
      
      <Projects />
      {/* Call to Action */}
      <CallToAction />

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

export default RawasyProjectsPage;