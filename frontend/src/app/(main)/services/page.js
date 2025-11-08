"use client"
import React, { useState, useEffect } from 'react';
import { 
  Building2, HardHat, Users, Wrench, Briefcase, Factory, 
  Zap, Shield, Award, CheckCircle, ArrowRight, Target,
  Hammer, Lightbulb, Settings, Package, Truck, ClipboardCheck,
  PenTool, Cpu, Sparkles, TrendingUp, Clock, Globe, Phone, Mail
} from 'lucide-react';

const ServicesPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = (window.scrollY / documentHeight) * 100;
      setScrollProgress(scrolled);

      const sections = document.querySelectorAll('.fade-section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8) {
          setVisibleSections(prev => new Set([...prev, section.id]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainServices = [
    {
      id: 'general-contracting',
      icon: Building2,
      title: "General Contracting",
      tagline: "Building Excellence, Delivering Quality",
      description: "As a Grade 1 licensed general contractor, RAWASY delivers comprehensive construction solutions for projects of any scale and complexity across the Gulf region.",
      color: "from-[#f1601f] to-[#7f3e2c]",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: Building2,
          title: "Commercial Construction",
          desc: "Office buildings, retail spaces, shopping malls, and mixed-use developments"
        },
        {
          icon: Factory,
          title: "Industrial Facilities",
          desc: "Manufacturing plants, warehouses, distribution centers, and processing facilities"
        },
        {
          icon: Hammer,
          title: "Infrastructure Projects",
          desc: "Roads, bridges, utilities, and civil engineering works"
        },
        {
          icon: Target,
          title: "Turnkey Solutions",
          desc: "Complete project delivery from design to handover with single-point responsibility"
        }
      ],
      features: [
        "Grade 1 Contractor License",
        "ISO 9001:2015 Quality Management",
        "Advanced Project Management",
        "Value Engineering Solutions",
        "BIM Implementation",
        "Safety Excellence (OHSAS 18001)"
      ]
    },
    {
      id: 'civil-mep',
      icon: Settings,
      title: "Civil & MEP Works",
      tagline: "Engineering Solutions for Modern Infrastructure",
      description: "Comprehensive mechanical, electrical, and plumbing installations combined with civil engineering expertise to create fully integrated building systems.",
      color: "from-[#0b1d34] to-[#13344c]",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: Zap,
          title: "Electrical Systems",
          desc: "Complete power distribution, lighting systems, and automation controls"
        },
        {
          icon: Settings,
          title: "Mechanical Systems",
          desc: "HVAC installations, ventilation, and climate control solutions"
        },
        {
          icon: Wrench,
          title: "Plumbing & Drainage",
          desc: "Water supply networks, sanitary systems, and drainage infrastructure"
        },
        {
          icon: Shield,
          title: "Fire Protection",
          desc: "Fire detection, suppression systems, and emergency safety installations"
        }
      ],
      features: [
        "Certified MEP Engineers",
        "Energy-Efficient Designs",
        "Preventive Maintenance Plans",
        "24/7 Emergency Support",
        "Smart Building Integration",
        "Code Compliance Assurance"
      ]
    },
    {
      id: 'manpower',
      icon: Users,
      title: "Manpower Supply",
      tagline: "Skilled Workforce, Delivered On-Demand",
      description: "Access to over 2000 highly trained and certified professionals across all construction disciplines, ready for immediate deployment to your projects.",
      color: "from-[#f1601f] to-[#d95417]",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: Users,
          title: "Engineering Staff",
          desc: "Civil, mechanical, electrical engineers and project managers"
        },
        {
          icon: HardHat,
          title: "Skilled Tradesmen",
          desc: "Welders, fabricators, fitters, electricians, and plumbers"
        },
        {
          icon: Cpu,
          title: "Technical Specialists",
          desc: "CAD operators, QA/QC inspectors, safety officers, and supervisors"
        },
        {
          icon: ClipboardCheck,
          title: "Support Staff",
          desc: "Administrative, logistics, and operational support personnel"
        }
      ],
      features: [
        "2000+ Trained Professionals",
        "Multi-Disciplinary Expertise",
        "Flexible Deployment Models",
        "Certified & Licensed",
        "Immediate Availability",
        "Performance Guaranteed"
      ]
    },
    {
      id: 'maintenance',
      icon: Wrench,
      title: "Maintenance Services",
      tagline: "Preserving Performance, Extending Life",
      description: "Comprehensive facility maintenance and asset management solutions ensuring optimal performance, longevity, and minimal downtime for your infrastructure.",
      color: "from-[#13344c] to-[#0b1d34]",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: Clock,
          title: "Preventive Maintenance",
          desc: "Scheduled inspections, servicing, and replacements to prevent failures"
        },
        {
          icon: Zap,
          title: "Corrective Repairs",
          desc: "Fast response emergency repairs and breakdown maintenance"
        },
        {
          icon: Target,
          title: "Facility Management",
          desc: "Complete building operations, utilities management, and housekeeping"
        },
        {
          icon: TrendingUp,
          title: "Asset Optimization",
          desc: "Performance monitoring, lifecycle management, and upgrade planning"
        }
      ],
      features: [
        "24/7 Emergency Response",
        "Computerized Maintenance Management",
        "Energy Efficiency Audits",
        "Spare Parts Management",
        "Predictive Analytics",
        "Long-term Contracts Available"
      ]
    },
    {
      id: 'trading',
      icon: Package,
      title: "Trading & Supply",
      tagline: "Quality Materials, Reliable Delivery",
      description: "Comprehensive supply of premium construction materials, equipment, and industrial products sourced from trusted global manufacturers and suppliers.",
      color: "from-[#7f3e2c] to-[#7f8994]",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: Package,
          title: "Construction Materials",
          desc: "Steel, cement, aggregates, finishing materials, and building supplies"
        },
        {
          icon: Truck,
          title: "Heavy Equipment",
          desc: "Machinery sales, rentals, and procurement services"
        },
        {
          icon: Shield,
          title: "Safety Equipment",
          desc: "PPE, safety gear, and site protection materials"
        },
        {
          icon: Lightbulb,
          title: "Technical Supplies",
          desc: "Tools, consumables, and specialized construction products"
        }
      ],
      features: [
        "Global Supplier Network",
        "Quality Certified Materials",
        "Competitive Pricing",
        "Just-in-Time Delivery",
        "Technical Support",
        "Bulk Order Discounts"
      ]
    },
    {
      id: 'metal-fabrication',
      icon: Factory,
      title: "Metal Fabrication",
      tagline: "Precision Engineering, Superior Craftsmanship",
      description: "State-of-the-art metal fabrication services with advanced CNC machinery, laser cutting technology, and expert craftsmanship for complex industrial applications.",
      color: "from-[#a6adb5] to-[#7f8994]",
      image: "https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: Zap,
          title: "Laser Cutting & Engraving",
          desc: "High-precision cutting and engraving for metal sheets and profiles"
        },
        {
          icon: Settings,
          title: "CNC Bending & Forming",
          desc: "Advanced bending, rolling, and forming of metal components"
        },
        {
          icon: Factory,
          title: "Steel Structures",
          desc: "Manufacturing of structural steel, trusses, and frameworks"
        },
        {
          icon: Hammer,
          title: "Custom Fabrication",
          desc: "Bespoke metalwork for architectural and industrial applications"
        }
      ],
      features: [
        "Advanced CNC Machinery",
        "Laser Cutting Technology",
        "Certified Welders",
        "Quality Testing Lab",
        "Custom Design Support",
        "Fast Turnaround Times"
      ]
    }
  ];

  const additionalServices = [
    {
      icon: HardHat,
      title: "Scaffolding & Formwork",
      desc: "Complete scaffolding systems, formwork solutions, and temporary structures for construction projects"
    },
    {
      icon: Shield,
      title: "Safety Management",
      desc: "Comprehensive HSE services, safety training, and risk assessment programs"
    },
    {
      icon: PenTool,
      title: "Design & Engineering",
      desc: "Architectural design, structural engineering, and technical consultancy services"
    },
    {
      icon: ClipboardCheck,
      title: "Quality Assurance",
      desc: "Independent QA/QC inspections, testing, and certification services"
    },
    {
      icon: Truck,
      title: "Logistics Support",
      desc: "Project logistics, material handling, and equipment transportation services"
    },
    {
      icon: Globe,
      title: "Project Management",
      desc: "Professional project management, planning, and coordination services"
    }
  ];

  const industries = [
    { name: "Oil & Gas", icon: Factory, projects: "150+", color: "from-orange-500 to-red-600" },
    { name: "Infrastructure", icon: Building2, projects: "200+", color: "from-blue-900 to-blue-700" },
    { name: "Commercial", icon: Briefcase, projects: "250+", color: "from-[#f1601f] to-[#7f3e2c]" },
    { name: "Industrial", icon: Settings, projects: "180+", color: "from-slate-700 to-slate-900" },
    { name: "Residential", icon: Building2, projects: "120+", color: "from-[#13344c] to-[#0b1d34]" },
    { name: "Healthcare", icon: Shield, projects: "90+", color: "from-[#7f3e2c] to-[#7f8994]" }
  ];

  const whyChoose = [
    {
      icon: Award,
      title: "15+ Years Excellence",
      desc: "Established reputation for quality and reliability since 2008"
    },
    {
      icon: Shield,
      title: "Grade 1 Licensed",
      desc: "Premium contractor license for large-scale projects"
    },
    {
      icon: CheckCircle,
      title: "ISO Certified",
      desc: "ISO 9001:2015, ISO 14001, and OHSAS 18001 certified"
    },
    {
      icon: Users,
      title: "2000+ Workforce",
      desc: "Skilled professionals ready for immediate deployment"
    },
    {
      icon: Target,
      title: "800+ Projects",
      desc: "Successfully delivered across the Gulf region"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Round-the-clock service and emergency response"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Sparkles className="text-[#f1601f]" size={20} />
              <span className="text-white font-semibold text-sm tracking-wider">COMPREHENSIVE SOLUTIONS</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            Our <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent">Services</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            From general contracting to specialized fabrication, we deliver integrated construction and industrial solutions that exceed expectations
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="#main-services" 
              className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Explore Services</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </a>
            <a 
              href="#contact" 
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section id="main-services" className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 fade-section" id="services-intro">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Core Capabilities</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Comprehensive Construction<br />& Industrial Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Six decades of combined expertise delivering excellence across every facet of construction and industrial services
            </p>
          </div>

          <div className="space-y-32">
            {mainServices.map((service, index) => (
              <div 
                key={service.id}
                id={service.id}
                className={`fade-section ${visibleSections.has(service.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}
              >
                <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="inline-block mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                        <service.icon className="text-white" size={40} />
                      </div>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-[#f1601f] font-bold text-lg mb-6">
                      {service.tagline}
                    </p>

                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {service.capabilities.map((cap, i) => (
                        <div key={i} className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-[#f1601f] hover:shadow-lg transition-all duration-300 group">
                          <cap.icon className="text-[#f1601f] mb-3 group-hover:scale-110 transition-transform duration-300" size={28} />
                          <h4 className="font-bold text-[#0b1d34] mb-2">{cap.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{cap.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8">
                      <h4 className="font-black text-lg text-[#0b1d34] mb-4 flex items-center">
                        <CheckCircle className="text-[#f1601f] mr-3" size={24} />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[#f1601f] rounded-full" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="relative group">
                      <div className={`absolute -inset-4 bg-gradient-to-br ${service.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                          <div className={`inline-block bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-xl font-bold mb-4`}>
                            Premium Service
                          </div>
                          <h4 className="text-3xl font-black text-white">{service.title}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Specialized Services</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
              Additional Capabilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complementary services to support your complete project lifecycle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, i) => (
              <div 
                key={i}
                className="group bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-8 hover:bg-white hover:border-white transition-all duration-500"
              >
                <service.icon className="text-[#f1601f] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" size={48} />
                <h3 className="text-2xl font-black text-white group-hover:text-[#0b1d34] mb-4 transition-colors duration-500">
                  {service.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-600 leading-relaxed transition-colors duration-500">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Industries We Serve</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Diverse Sector Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven track record across multiple industries throughout the Gulf region
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, i) => (
              <div key={i} className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-10 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-br ${industry.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <industry.icon className="text-white" size={36} />
                  </div>
                  
                  <h3 className="text-3xl font-black text-[#0b1d34] mb-3">
                    {industry.name}
                  </h3>
                  
                  <div className="flex items-center space-x-3 text-[#f1601f] font-bold">
                    <span className="text-4xl">{industry.projects}</span>
                    <span className="text-sm">Completed Projects</span>
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
              Your Trusted Partner
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Backed by certifications, experience, and an unwavering commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoose.map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white border-2 border-gray-100 group-hover:border-transparent rounded-2xl p-8 group-hover:text-white transition-all duration-500">
                  <item.icon className="text-[#f1601f] group-hover:text-white mb-6 group-hover:scale-110 transition-all duration-500" size={48} />
                  <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-3 transition-colors duration-500">
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Let's Build Your<br />
            <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">
              Next Project Together
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Contact our team to discuss your requirements and discover how RAWASY's comprehensive services can bring your vision to life
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a 
              href="#contact" 
              className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3"
            >
              <span>Request a Quote</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a 
              href="tel:+971XXXXXXXX" 
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center"
            >
              Call Us Today
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16 border-t border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">800+ Projects</h4>
              <p className="text-gray-400">Successfully Delivered</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">2000+ Workforce</h4>
              <p className="text-gray-400">Skilled Professionals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">15+ Years</h4>
              <p className="text-gray-400">Industry Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Get In Touch</span>
              <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                Let's Discuss Your Project
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12">
                Our team of experts is ready to help you bring your vision to life. Contact us today for a consultation and detailed project quotation.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1d34] mb-1">Call Us</h4>
                    <p className="text-gray-600">+971 XX XXX XXXX</p>
                    <p className="text-sm text-gray-500">Mon-Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1d34] mb-1">Email Us</h4>
                    <p className="text-gray-600">info@rawasy.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b1d34] mb-1">Visit Our Office</h4>
                    <p className="text-gray-600">Gulf Region</p>
                    <p className="text-sm text-gray-500">Serving UAE and surrounding areas</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl">
                <h4 className="text-white font-black text-xl mb-4">Why Choose RAWASY?</h4>
                <ul className="space-y-3">
                  {[
                    "Grade 1 Contractor License",
                    "ISO 9001:2015 Certified",
                    "15+ Years of Excellence",
                    "2000+ Skilled Workforce",
                    "24/7 Emergency Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-white">
                      <CheckCircle className="text-[#f1601f] flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl p-8 lg:p-12">
              <h3 className="text-3xl font-black text-[#0b1d34] mb-8">Request a Quote</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">First Name *</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">Service Required *</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Select a service</option>
                    <option value="general-contracting">General Contracting</option>
                    <option value="civil-mep">Civil & MEP Works</option>
                    <option value="manpower">Manpower Supply</option>
                    <option value="maintenance">Maintenance Services</option>
                    <option value="trading">Trading & Supply</option>
                    <option value="metal-fabrication">Metal Fabrication</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">Project Details *</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <span>Submit Request</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our privacy policy. We'll contact you within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Banner */}
      <section className="py-20 bg-gradient-to-r from-[#0b1d34] to-[#13344c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-white mb-2">Certified Excellence</h3>
            <p className="text-gray-300">Backed by international standards and industry certifications</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "ISO 9001:2015", desc: "Quality Management System" },
              { title: "ISO 14001", desc: "Environmental Management" },
              { title: "OHSAS 18001", desc: "Occupational Health & Safety" },
              { title: "Grade 1 License", desc: "Premium Contractor" }
            ].map((cert, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <Award className="text-[#f1601f]" size={36} />
                </div>
                <h4 className="text-white font-bold mb-1">{cert.title}</h4>
                <p className="text-gray-400 text-sm">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .fade-section {
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;