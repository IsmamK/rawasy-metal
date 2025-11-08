
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Phone, Mail, MapPin, Award, Shield, TrendingUp, Users, Building2, Wrench, HardHat, Briefcase, Star, CheckCircle, Clock, Target, Zap, Globe } from 'lucide-react';

const RawasyHomepage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const services = [
    {
      icon: Building2,
      title: "General Contracting",
      subtitle: "Building Excellence",
      description: "From concept to completion, we deliver comprehensive construction solutions with unmatched precision and quality.",
      features: ["Commercial Buildings", "Industrial Facilities", "Infrastructure Projects", "Turnkey Solutions"],
      color: "from-orange-500 to-red-600"
    },
    {
      icon: HardHat,
      title: "Civil & MEP Works",
      subtitle: "Engineering Mastery",
      description: "Advanced mechanical, electrical, and plumbing solutions that power modern infrastructure.",
      features: ["HVAC Systems", "Electrical Installations", "Plumbing Networks", "Fire Safety Systems"],
      color: "from-blue-900 to-blue-700"
    },
    {
      icon: Users,
      title: "Manpower Supply",
      subtitle: "Skilled Workforce",
      description: "Access to highly trained professionals across all construction disciplines and specializations.",
      features: ["Engineers & Technicians", "Skilled Labor", "Project Management", "Quality Assurance Teams"],
      color: "from-orange-600 to-orange-800"
    },
    {
      icon: Wrench,
      title: "Maintenance Services",
      subtitle: "Ongoing Support",
      description: "Comprehensive facility management and maintenance solutions to ensure optimal performance.",
      features: ["Preventive Maintenance", "Emergency Repairs", "Facility Management", "Asset Optimization"],
      color: "from-slate-700 to-slate-900"
    },
    {
      icon: Briefcase,
      title: "Trading & Supply",
      subtitle: "Quality Materials",
      description: "Premium construction materials and equipment sourced from trusted global suppliers.",
      features: ["Construction Materials", "Heavy Equipment", "Safety Gear", "Technical Supplies"],
      color: "from-orange-500 to-orange-700"
    }
  ];

  const stats = [
    { icon: Award, number: "15+", label: "Years of Excellence", detail: "Industry Leadership" },
    { icon: Building2, number: "800+", label: "Projects Delivered", detail: "Across Gulf Region" },
    { icon: Users, number: "2000+", label: "Skilled Workforce", detail: "Ready to Deploy" },
    { icon: Globe, number: "50+", label: "Major Clients", detail: "Trusted Partners" }
  ];

  const certifications = [
    { title: "ISO 9001:2015", desc: "Quality Management", icon: Award },
    { title: "OHSAS 18001", desc: "Safety Standards", icon: Shield },
    { title: "Grade 1 License", desc: "Premium Contractor", icon: Star },
    { title: "ISO 14001", desc: "Environmental", icon: Target }
  ];

  const sectors = [
    { name: "Oil & Gas", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop", projects: "150+" },
    { name: "Infrastructure", img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop", projects: "200+" },
    { name: "Commercial", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", projects: "250+" },
    { name: "Industrial", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", projects: "180+" },
    { name: "Residential", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop", projects: "120+" },
    { name: "Healthcare", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop", projects: "90+" }
  ];

  const values = [
    { icon: Target, title: "Excellence", desc: "Uncompromising quality in every project" },
    { icon: Shield, title: "Safety First", desc: "Zero-harm workplace culture" },
    { icon: Clock, title: "Timely Delivery", desc: "Meeting deadlines without exception" },
    { icon: Zap, title: "Innovation", desc: "Cutting-edge construction methods" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
   
      {/* Hero Section - Cinematic */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black"></div>
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover mix-blend-overlay" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Animated shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm tracking-wider">TRUSTED SINCE 2008</span>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                <span className="text-white block">Building</span>
                <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent block">Tomorrow's</span>
                <span className="text-white block">Infrastructure</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Leading the Gulf region's construction excellence with innovative solutions, skilled workforce, and unwavering commitment to quality.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#services" className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3">
                  <span>Explore Services</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </a>
                <a href="#projects" className="bg-white/10 backdrop-blur-sm text-white px-8 py-5 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300">
                  View Projects
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {[
                  { icon: Phone, text: "+971 XX XXX XXXX" },
                  { icon: Mail, text: "info@rawasy.com" }
                ].map((contact, i) => (
                  <div key={i} className="flex items-center space-x-3 text-gray-300 hover:text-[#f1601f] transition-colors duration-300 cursor-pointer">
                    <contact.icon size={20} />
                    <span className="text-sm font-medium">{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 space-y-6">
                  {stats.slice(0, 4).map((stat, i) => (
                    <div key={i} className="flex items-center space-x-4 group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="text-white" size={28} />
                      </div>
                      <div>
                        <div className="text-4xl font-black text-white">{stat.number}</div>
                        <div className="text-gray-400 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl shadow-2xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center group cursor-pointer">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                    <stat.icon className="text-white" size={32} />
                  </div>
                  <div className="text-5xl font-black text-white mb-2">{stat.number}</div>
                  <div className="text-white/90 font-bold text-lg">{stat.label}</div>
                  <div className="text-white/70 text-sm">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Overlapping Layout */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -skew-x-12 transform translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -left-8 -top-8 text-9xl font-black text-gray-100">01</div>
              <div className="relative space-y-6">
                <div className="inline-block">
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">About RAWASY</span>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] mt-2"></div>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] leading-tight">
                  Engineering Excellence Since 2008
                </h2>
                
                <p className="text-xl text-[#7f8994] leading-relaxed">
                  RAWASY stands as a premier contracting and trading company, delivering comprehensive construction, manpower, and industrial solutions across the Gulf region.
                </p>
                
                <p className="text-lg text-[#7f8994] leading-relaxed">
                  With over 15 years of proven expertise, we've built our reputation on reliability, innovation, and excellence. Our multidisciplinary team tackles projects of any scale and complexity, ensuring quality craftsmanship and timely delivery.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6">
                  {values.map((value, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-xl hover:bg-gradient-to-br hover:from-[#f1601f] hover:to-[#7f3e2c] hover:text-white transition-all duration-300 group">
                      <value.icon className="mb-4 text-[#f1601f] group-hover:text-white" size={32} />
                      <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                      <p className="text-sm opacity-80">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=500&fit=crop" alt="Construction" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="relative h-80 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=600&fit=crop" alt="Industrial" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="relative h-80 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=600&fit=crop" alt="Infrastructure" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=500&fit=crop" alt="Commercial" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-12 bg-white rounded-2xl shadow-2xl p-8 max-w-xs">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#0b1d34]">800+</div>
                    <div className="text-sm text-gray-600 font-medium">Completed Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300 group">
                <cert.icon className="text-[#f1601f] mb-4 group-hover:scale-110 transition-transform duration-300" size={36} />
                <h3 className="font-black text-lg text-[#0b1d34] mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

          <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-[#f9fafb] scroll-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block px-4 py-1 rounded-full bg-[#f1601f]/10 text-[#f1601f] font-medium text-sm mb-6">
                Leading Metal & Construction Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0b1d34] mb-6 leading-tight">
                Building Foundations for <span className="text-[#f1601f]">Progress</span>
              </h1>
              <p className="text-lg text-[#7f8994] mb-8 max-w-lg">
                At RAWASY, we are dedicated to delivering excellence in the metal industry through innovation, precision, and reliability.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="/" className="px-6 py-3 bg-[#f1601f] text-white font-medium rounded-lg hover:bg-[#d95417] transition-colors text-center">
                  Learn More About Us
                </a>
                <a href="/projects" className="px-6 py-3 bg-white border border-[#a6adb5] text-[#0b1d34] font-medium rounded-lg hover:bg-gray-50 transition-colors text-center">
                  View Our Projects
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#f1601f] rounded-xl"></div>
                <div className="relative bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Our Expertise</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#f1601f] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Laser Cutting & Engraving</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#f1601f] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>CNC Bending & Fabrication</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#f1601f] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Steel Structure Manufacturing</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#f1601f] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Scaffolding & Formwork Systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Interactive Cards */}
      <section id="services" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #f1601f 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Our Services</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Comprehensive Solutions for<br />Every Construction Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From groundbreaking to project completion, we deliver integrated services that exceed expectations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {services.map((service, i) => (
              <div 
                key={i}
                onMouseEnter={() => setActiveService(i)}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${activeService === i ? 'scale-105 z-10' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-0 group-hover:opacity-95 transition-opacity duration-500"></div>
                
                <div className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <service.icon className="text-white" size={36} />
                    </div>
                    <div className="text-6xl font-black text-gray-100 group-hover:text-white/10 transition-colors duration-500">
                      0{i + 1}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-bold text-[#f1601f] group-hover:text-orange-400 transition-colors duration-300">
                        {service.subtitle}
                      </div>
                      <h3 className="text-3xl font-black text-[#0b1d34] group-hover:text-white transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {service.features.map((feature, j) => (
                        <div key={j} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="text-[#f1601f] group-hover:text-green-400 flex-shrink-0" size={16} />
                          <span className="text-gray-700 group-hover:text-white transition-colors duration-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="mt-6 inline-flex items-center space-x-2 text-[#f1601f] group-hover:text-white font-bold transition-colors duration-300">
                      <span>Learn More</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section - Grid Masonry */}
      <section id="sectors" className="py-32 bg-[#0b1d34] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Industry Sectors</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
              Serving Diverse Industries<br />Across the Gulf Region
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, i) => (
              <div key={i} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                <img src={sector.img} alt={sector.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-[#f1601f] group-hover:via-[#f1601f]/80 transition-all duration-500"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform group-hover:-translate-y-4 transition-transform duration-500">
                    <div className="text-white/70 font-bold text-sm mb-2">{sector.projects} Projects</div>
                    <h3 className="text-3xl font-black text-white">{sector.name}</h3>
                  </div>
                  <div className="mt-4 flex items-center space-x-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="font-semibold">View Projects</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Featured Projects</span>
              <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                Excellence in<br />Every Project
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                From large-scale infrastructure to precision industrial facilities, our portfolio showcases versatility, innovation, and unwavering commitment to quality.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">150+</div>
                  <div className="text-sm text-gray-600">Oil & Gas Projects</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">200+</div>
                  <div className="text-sm text-gray-600">Infrastructure Works</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">250+</div>
                  <div className="text-sm text-gray-600">Commercial Buildings</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">180+</div>
                  <div className="text-sm text-gray-600">Industrial Facilities</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
                title: "Petrochemical Complex",
                category: "Oil & Gas",
                desc: "State-of-the-art processing facility with advanced safety systems"
              },
              {
                img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop",
                title: "Highway Infrastructure",
                category: "Infrastructure",
                desc: "200km highway development with modern interchanges"
              },
              {
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
                title: "Corporate Headquarters",
                category: "Commercial",
                desc: "LEED-certified sustainable office complex"
              }
            ].map((project, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="relative h-96">
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="inline-block mb-3">
                    <span className="bg-[#f1601f] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">{project.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{project.desc}</p>
                  <div className="flex items-center space-x-2 text-white font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span>View Details</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Why Choose RAWASY</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Proven Track Record",
                desc: "Over 800 successfully delivered projects across diverse sectors with 100% client satisfaction rate"
              },
              {
                icon: Users,
                title: "Expert Workforce",
                desc: "2000+ certified professionals including engineers, technicians, and skilled craftsmen ready to deploy"
              },
              {
                icon: Shield,
                title: "Safety Excellence",
                desc: "Zero-harm workplace culture with OHSAS 18001 certification and rigorous safety protocols"
              },
              {
                icon: Clock,
                title: "Timely Delivery",
                desc: "Advanced project management systems ensuring on-time completion without compromising quality"
              },
              {
                icon: Award,
                title: "Quality Assurance",
                desc: "ISO 9001:2015 certified processes with comprehensive quality control at every project phase"
              },
              {
                icon: Zap,
                title: "Innovation Driven",
                desc: "Cutting-edge construction technologies and methodologies for optimal efficiency and results"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white border-2 border-gray-100 group-hover:border-transparent rounded-3xl p-10 group-hover:text-white transition-all duration-500">
                  <item.icon className="text-[#f1601f] group-hover:text-white mb-6 group-hover:scale-110 transition-all duration-500" size={48} />
                  <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Ready to Build<br />
            <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">
              Something Extraordinary?
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's discuss your project requirements and discover how RAWASY can bring your vision to life with precision and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#contact" className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3">
              <span>Start Your Project</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a href="#services" className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center">
              Explore Our Services
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-white/10">
            <div>
              <Phone className="text-[#f1601f] mx-auto mb-4" size={32} />
              <div className="text-white font-bold mb-2">Call Us</div>
              <div className="text-gray-400">+971 XX XXX XXXX</div>
            </div>
            <div>
              <Mail className="text-[#f1601f] mx-auto mb-4" size={32} />
              <div className="text-white font-bold mb-2">Email Us</div>
              <div className="text-gray-400">info@rawasy.com</div>
            </div>
            <div>
              <MapPin className="text-[#f1601f] mx-auto mb-4" size={32} />
              <div className="text-white font-bold mb-2">Visit Us</div>
              <div className="text-gray-400">Gulf Region</div>
            </div>
          </div>
        </div>
      </section>


      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default RawasyHomepage;