"use client"
import React, { useState, useEffect } from 'react';
import { 
  Building2, Factory, HardHat, Wrench, Package, Settings, 
  Filter, Search, X, ZoomIn, ChevronLeft, ChevronRight, 
  Download, Share2, Calendar, MapPin, Users, Award,
  Sparkles, ArrowRight, ChevronDown, CheckCircle
} from 'lucide-react';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Projects', icon: Building2, count: 156 },
    { id: 'metal-fabrication', name: 'Metal Fabrication', icon: Factory, count: 42 },
    { id: 'structural-steel', name: 'Structural Steel', icon: HardHat, count: 38 },
    { id: 'industrial-installation', name: 'Industrial Installation', icon: Settings, count: 28 },
    { id: 'mep-works', name: 'MEP Works', icon: Wrench, count: 24 },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, count: 16 },
    { id: 'trading-supply', name: 'Trading & Supply', icon: Package, count: 8 }
  ];

  const projects = [
    {
      id: 1,
      title: "Steel Structure Manufacturing",
      category: 'metal-fabrication',
      location: "Dubai Industrial City",
      year: "2023",
      client: "Emirates Steel",
      description: "Precision fabrication of structural steel components for industrial facility expansion",
      images: [
        "https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["CNC Cutting", "Laser Welding", "Quality Testing", "Custom Fabrication"]
    },
    {
      id: 2,
      title: "Oil & Gas Pipeline Support",
      category: 'structural-steel',
      location: "Abu Dhabi",
      year: "2023",
      client: "ADNOC",
      description: "Heavy-duty structural steel supports for offshore pipeline infrastructure",
      images: [
        "https://images.unsplash.com/photo-1613843661100-3ec9e97a80bc?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Marine Grade Steel", "Corrosion Protection", "Heavy Load Capacity"]
    },
    {
      id: 3,
      title: "Industrial Plant Equipment Installation",
      category: 'industrial-installation',
      location: "Jebel Ali",
      year: "2023",
      client: "Dubai Industrial Park",
      description: "Installation of heavy machinery and processing equipment with precision alignment",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Precision Alignment", "Safety Compliance", "Commissioning Support"]
    },
    {
      id: 4,
      title: "Commercial Building MEP Systems",
      category: 'mep-works',
      location: "Business Bay, Dubai",
      year: "2023",
      client: "Emaar Properties",
      description: "Complete mechanical, electrical, and plumbing systems for high-rise tower",
      images: [
        "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Energy Efficient", "Smart Systems", "LEED Certified"]
    },
    {
      id: 5,
      title: "Metal Workshop Facility",
      category: 'metal-fabrication',
      location: "Sharjah",
      year: "2023",
      client: "Gulf Metal Works",
      description: "Custom metal fabrication workshop with advanced CNC machinery",
      images: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["CNC Machinery", "Quality Control", "Custom Solutions"]
    },
    {
      id: 6,
      title: "Structural Steel Bridge Components",
      category: 'structural-steel',
      location: "Al Ain",
      year: "2023",
      client: "Ministry of Infrastructure",
      description: "Fabrication and installation of structural steel components for highway bridge",
      images: [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["High-Strength Steel", "Precision Engineering", "Durability"]
    },
    {
      id: 7,
      title: "Industrial Maintenance Overhaul",
      category: 'maintenance',
      location: "Ras Al Khaimah",
      year: "2023",
      client: "RAK Industrial Zone",
      description: "Comprehensive maintenance and repair of industrial metal structures",
      images: [
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Preventive Maintenance", "24/7 Support", "Quality Assurance"]
    },
    {
      id: 8,
      title: "Steel Supply for Construction",
      category: 'trading-supply',
      location: "Across UAE",
      year: "2023",
      client: "Multiple Projects",
      description: "Supply of high-quality steel materials for various construction projects",
      images: [
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Quality Materials", "Timely Delivery", "Competitive Pricing"]
    },
    {
      id: 9,
      title: "Custom Metal Artwork",
      category: 'metal-fabrication',
      location: "Dubai Design District",
      year: "2023",
      client: "Art Gallery Dubai",
      description: "Bespoke metal artwork and architectural features for luxury development",
      images: [
        "https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Artistic Design", "Precision Craftsmanship", "Custom Finishes"]
    },
    {
      id: 10,
      title: "Industrial Pipe Support Systems",
      category: 'structural-steel',
      location: "Fujairah",
      year: "2023",
      client: "Fujairah Refinery",
      description: "Heavy-duty pipe support systems for refinery expansion project",
      images: [
        "https://images.unsplash.com/photo-1613843661100-3ec9e97a80bc?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["High Temperature Rated", "Vibration Resistant", "Custom Engineering"]
    },
    {
      id: 11,
      title: "HVAC Ductwork Fabrication",
      category: 'metal-fabrication',
      location: "Abu Dhabi",
      year: "2023",
      client: "Mubadala Development",
      description: "Custom HVAC ductwork fabrication for commercial complex",
      images: [
        "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Precision Fabrication", "Energy Efficient", "Noise Reduction"]
    },
    {
      id: 12,
      title: "Steel Storage Solutions",
      category: 'metal-fabrication',
      location: "Dubai Logistics City",
      year: "2023",
      client: "DP World",
      description: "Custom steel storage racks and warehouse solutions",
      images: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Heavy Duty", "Space Optimization", "Safety Compliant"]
    }
  ];

  const stats = [
    { label: "Projects Completed", value: "800+", icon: Building2 },
    { label: "Metal Structures", value: "450+", icon: Factory },
    { label: "Satisfied Clients", value: "200+", icon: Users },
    { label: "Years Excellence", value: "15+", icon: Award }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const nextImage = () => {
    if (selectedImage) {
      const currentProject = projects.find(p => p.id === selectedImage.projectId);
      const currentIndex = currentProject.images.findIndex(img => img === selectedImage.src);
      const nextIndex = (currentIndex + 1) % currentProject.images.length;
      setSelectedImage({
        ...selectedImage,
        src: currentProject.images[nextIndex],
        imageIndex: nextIndex
      });
    }
  };

  const prevImage = () => {
    if (selectedImage) {
      const currentProject = projects.find(p => p.id === selectedImage.projectId);
      const currentIndex = currentProject.images.findIndex(img => img === selectedImage.src);
      const prevIndex = (currentIndex - 1 + currentProject.images.length) % currentProject.images.length;
      setSelectedImage({
        ...selectedImage,
        src: currentProject.images[prevIndex],
        imageIndex: prevIndex
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34]">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1920&h=1080&fit=crop" 
              alt="Metal Fabrication Background" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-sm tracking-wider">OUR WORK GALLERY</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Metal <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Mastery</span> in Action
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Showcasing our expertise in metal fabrication, structural steel works, and industrial solutions across the Gulf region
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

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-[#0b1d34] mb-2">
              {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-[#7f8994]">Showing {filteredProjects.length} projects with {filteredProjects.reduce((acc, proj) => acc + proj.images.length, 0)} images</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Project Images */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onLoad={() => handleImageLoad(`${project.id}-0`)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Image Count Badge */}
                  {project.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                      +{project.images.length - 1}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#f1601f] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={() => setSelectedImage({
                      src: project.images[0],
                      projectId: project.id,
                      project: project,
                      imageIndex: 0
                    })}
                    className="absolute top-4 right-16 bg-black/80 text-white p-2 rounded-full hover:bg-[#f1601f] transition-colors duration-300"
                  >
                    <ZoomIn size={16} />
                  </button>

                  {/* Project Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-[#f1601f] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <MapPin size={14} />
                      <span>{project.location}</span>
                      <Calendar size={14} />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <p className="text-[#7f8994] text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-[#7f8994]">
                      <Users size={16} />
                      <span className="font-medium">{project.client}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.features.slice(0, 2).map((feature, j) => (
                      <span
                        key={j}
                        className="bg-gray-100 text-[#7f8994] px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {project.features.length > 2 && (
                      <span className="bg-gray-100 text-[#7f8994] px-3 py-1 rounded-full text-xs font-medium">
                        +{project.features.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* View Gallery Button */}
                  <button
                    onClick={() => setSelectedImage({
                      src: project.images[0],
                      projectId: project.id,
                      project: project,
                      imageIndex: 0
                    })}
                    className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <span>View Gallery</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </button>
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

      {/* Process Section */}
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Our Process</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
              From Concept to Completion
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our systematic approach ensures precision, quality, and timely delivery in every metal fabrication project
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Design & Engineering",
                desc: "Advanced CAD/CAM design and structural engineering analysis",
                icon: Sparkles
              },
              {
                step: "02",
                title: "Material Selection",
                desc: "Careful selection of high-quality metals and materials",
                icon: Package
              },
              {
                step: "03",
                title: "Precision Fabrication",
                desc: "State-of-the-art CNC machinery and skilled craftsmanship",
                icon: Settings
              },
              {
                step: "04",
                title: "Quality Assurance",
                desc: "Rigorous testing and inspection before delivery",
                icon: CheckCircle
              }
            ].map((process, i) => (
              <div key={i} className="group text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                    <span className="text-white font-black text-xl">{process.step}</span>
                  </div>
                  <process.icon className="absolute -top-2 -right-2 text-[#f1601f]" size={24} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{process.title}</h3>
                <p className="text-gray-400 leading-relaxed">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-[#f1601f] transition-colors duration-300"
            >
              <X className="text-white" size={24} />
            </button>

            {/* Navigation Buttons */}
            {selectedImage.project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-[#f1601f] transition-colors duration-300"
                >
                  <ChevronLeft className="text-white" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-[#f1601f] transition-colors duration-300"
                >
                  <ChevronRight className="text-white" size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.project.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-b-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-[#0b1d34] mb-2">
                    {selectedImage.project.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-[#7f8994]">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{selectedImage.project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{selectedImage.project.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{selectedImage.project.client}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#f1601f] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {categories.find(c => c.id === selectedImage.project.category)?.name}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{selectedImage.project.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Image {selectedImage.imageIndex + 1} of {selectedImage.project.images.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Download size={16} />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Share2 size={16} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1920&h=1080&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Ready to Start Your <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Metal Project?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's collaborate to bring your metal fabrication and construction needs to life with our proven expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/contact" className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3">
              <span>Get Started Today</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a href="/services" className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center">
              View Our Services
            </a>
          </div>
        </div>
      </section>

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