"use client"
import React, { useState, useEffect } from 'react';
import { Building2, Factory, Droplets, Zap, Home, Hospital, ArrowRight, Filter, Search, MapPin, Calendar, Users, Award, CheckCircle, TrendingUp, ChevronDown, ChevronRight, X } from 'lucide-react';

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

  const stats = [
    { label: "Total Projects", value: "800+", icon: Building2 },
    { label: "Active Projects", value: "45+", icon: TrendingUp },
    { label: "Total Value", value: "$2.5B+", icon: Award },
    { label: "Client Satisfaction", value: "100%", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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

          {/* Stats */}
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
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7f8994]" size={20} />
              <input
                type="text"
                placeholder="Search projects, locations, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300 font-medium"
              />
            </div>

            {/* Category Filter - Desktop */}
            <div className="hidden lg:flex items-center space-x-3 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white shadow-lg'
                      : 'bg-gray-100 text-[#7f8994] hover:bg-gray-200'
                  }`}
                >
                  <cat.icon size={18} />
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-80">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white rounded-xl font-bold"
            >
              <Filter size={20} />
              <span>Filter by Category</span>
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          {isFilterOpen && (
            <div className="lg:hidden mt-4 bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-4 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl font-bold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white'
                      : 'bg-gray-50 text-[#7f8994] hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <cat.icon size={20} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-sm opacity-80">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-[#0b1d34] mb-2">
              {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-[#7f8994]">Showing {filteredProjects.length} projects</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/95 backdrop-blur-sm text-[#f1601f] px-4 py-2 rounded-full text-xs font-bold tracking-wider">
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{project.location}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#7f8994] text-sm font-semibold">{project.year}</span>
                    <span className="text-[#f1601f] text-sm font-bold">{project.value}</span>
                  </div>

                  <h3 className="text-xl font-black text-[#0b1d34] mb-3 group-hover:text-[#f1601f] transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-[#7f8994] text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-[#7f8994]">
                      <Users size={16} />
                      <span className="font-medium">{project.client}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#f1601f] font-bold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">View Details</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-[#7f8994]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0b1d34] mb-3">No Projects Found</h3>
              <p className="text-[#7f8994] mb-8">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full my-8 relative animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 z-10"
            >
              <X className="text-[#0b1d34]" size={24} />
            </button>

            {/* Hero Image */}
            <div className="relative h-96 rounded-t-3xl overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-block mb-4">
                  <span className="bg-[#f1601f] text-white px-4 py-2 rounded-full text-sm font-bold tracking-wider">
                    {categories.find(c => c.id === selectedProject.category)?.name}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <MapPin size={18} />
                    <span className="font-medium">{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span className="font-medium">{selectedProject.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={18} />
                    <span className="font-medium">{selectedProject.client}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black text-[#f1601f] mb-2">{selectedProject.value}</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Project Value</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black text-[#f1601f] mb-2">{selectedProject.duration}</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Duration</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black text-[#f1601f] mb-2">{selectedProject.year}</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Completion Year</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <Award className="text-[#f1601f] mx-auto mb-2" size={32} />
                  <div className="text-sm font-semibold text-[#7f8994]">Award Winner</div>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#0b1d34] mb-4">Project Overview</h3>
                <p className="text-lg text-[#7f8994] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Scope of Work */}
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#0b1d34] mb-6">Scope of Work</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedProject.scope.map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                      <CheckCircle className="text-[#f1601f] flex-shrink-0" size={20} />
                      <span className="font-semibold text-[#0b1d34]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-[#0b1d34] mb-4">Challenge</h3>
                  <p className="text-[#7f8994] leading-relaxed">{selectedProject.challenges}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-[#0b1d34] mb-4">Solution</h3>
                  <p className="text-[#7f8994] leading-relaxed">{selectedProject.solution}</p>
                </div>
              </div>

              {/* Results & Impact */}
              <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-black mb-6">Results & Impact</h3>
                <div className="space-y-4">
                  {selectedProject.results.map((result, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle size={20} />
                      </div>
                      <p className="text-lg text-white/90 leading-relaxed">{result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Ready to Start Your <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Next Project?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's collaborate to bring your vision to life with our proven expertise and commitment to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/contact" className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3">
              <span>Get Started Today</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a href="/about" className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center">
              Learn More About Us
            </a>
          </div>
        </div>
      </section>

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