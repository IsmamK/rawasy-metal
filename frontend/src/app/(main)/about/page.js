"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Mail, MapPin, Award, Shield, Target, Users, Building2, Wrench, TrendingUp, Globe, CheckCircle, Factory, Briefcase, HardHat, Zap, Clock, Star, ArrowRight, ChevronDown, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const RawasyAboutPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



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
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-sm tracking-wider">ESTABLISHED 2008</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              About <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">RAWASY</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Your trusted partner in building the future of the Gulf region with excellence, innovation, and unwavering commitment to quality.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/50" size={32} />
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6 leading-tight">
                  Building Excellence Since 2008
                </h2>
              </div>
              
              <p className="text-lg text-[#7f8994] leading-relaxed">
                RAWASY is a premier contracting and trading company based in the Gulf region, specializing in comprehensive construction solutions, skilled manpower supply, and industrial services. With over 15 years of proven expertise, we have established ourselves as a trusted partner for projects of all scales and complexities.
              </p>
              
              <p className="text-lg text-[#7f8994] leading-relaxed">
                Our commitment to excellence, safety, and innovation has enabled us to successfully deliver over 800 projects across diverse sectors including oil & gas, infrastructure, commercial, industrial, and residential developments.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">15+</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Years of Excellence</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">800+</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Projects Completed</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">2000+</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Skilled Workforce</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl font-black text-[#0b1d34] mb-2">50+</div>
                  <div className="text-sm font-semibold text-[#7f8994]">Major Clients</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop" alt="Construction" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=500&fit=crop" alt="Industrial" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=500&fit=crop" alt="Infrastructure" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" alt="Commercial" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Our Foundation</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4">Mission, Vision & Values</h2>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl shadow-lg p-2">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'mission' ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white' : 'text-[#7f8994] hover:text-[#f1601f]'}`}
              >
                Mission
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'vision' ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white' : 'text-[#7f8994] hover:text-[#f1601f]'}`}
              >
                Vision
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'values' ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white' : 'text-[#7f8994] hover:text-[#f1601f]'}`}
              >
                Values
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {activeTab === 'mission' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Target className="text-white" size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[#0b1d34] mb-6">Our Mission</h3>
                    <p className="text-xl text-[#7f8994] leading-relaxed mb-6">
                      To deliver exceptional construction, manpower, and industrial solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety and sustainability.
                    </p>
                    <p className="text-lg text-[#7f8994] leading-relaxed">
                      We strive to be the partner of choice for clients seeking reliable, efficient, and comprehensive solutions for projects of any scale and complexity across the Gulf region.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Globe className="text-white" size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[#0b1d34] mb-6">Our Vision</h3>
                    <p className="text-xl text-[#7f8994] leading-relaxed mb-6">
                      To be recognized as the leading contracting and trading company in the Gulf region, setting industry standards for excellence, innovation, and sustainable development.
                    </p>
                    <p className="text-lg text-[#7f8994] leading-relaxed">
                      We envision a future where RAWASY continues to shape the region's infrastructure landscape while fostering long-term partnerships built on trust, quality, and mutual success.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn">
                <h3 className="text-3xl font-black text-[#0b1d34] mb-8 text-center">Core Values That Drive Us</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Award, title: "Excellence", desc: "Pursuing the highest standards in every project, ensuring quality craftsmanship and attention to detail" },
                    { icon: Shield, title: "Safety First", desc: "Maintaining zero-harm workplace culture with comprehensive safety protocols and OHSAS 18001 compliance" },
                    { icon: Clock, title: "Reliability", desc: "Delivering projects on time and within budget without compromising quality or safety standards" },
                    { icon: Users, title: "Integrity", desc: "Conducting business with transparency, honesty, and ethical practices in all our dealings" },
                    { icon: Zap, title: "Innovation", desc: "Embracing cutting-edge technologies and methodologies to deliver superior results" },
                    { icon: Target, title: "Client Focus", desc: "Prioritizing client satisfaction through responsive service and exceeding expectations" }
                  ].map((value, i) => (
                    <div key={i} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-[#f1601f] hover:to-[#7f3e2c] hover:text-white transition-all duration-300 group">
                      <value.icon className="text-[#f1601f] group-hover:text-white flex-shrink-0" size={32} />
                      <div>
                        <h4 className="text-lg font-bold text-[#0b1d34] group-hover:text-white mb-2">{value.title}</h4>
                        <p className="text-sm text-[#7f8994] group-hover:text-white/90">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">Core Capabilities</h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Comprehensive solutions across all aspects of construction, trading, and workforce management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "General Contracting",
                desc: "End-to-end construction management including civil works, structural engineering, and project execution for commercial, industrial, and residential developments.",
                features: ["Commercial Buildings", "Industrial Facilities", "Infrastructure Projects", "Turnkey Solutions"]
              },
              {
                icon: Wrench,
                title: "Civil & MEP Works",
                desc: "Comprehensive mechanical, electrical, and plumbing solutions with expertise in HVAC, electrical installations, and fire safety systems.",
                features: ["HVAC Systems", "Electrical Installations", "Plumbing Networks", "Fire Safety"]
              },
              {
                icon: Users,
                title: "Manpower Supply",
                desc: "Access to over 2000 skilled professionals including engineers, technicians, and specialized workforce ready for immediate deployment.",
                features: ["Engineers & Technicians", "Skilled Labor", "Project Management", "Quality Teams"]
              },
              {
                icon: HardHat,
                title: "Maintenance Services",
                desc: "Ongoing facility management, preventive maintenance, and emergency repair services to ensure optimal performance of your assets.",
                features: ["Preventive Maintenance", "Emergency Repairs", "Facility Management", "Asset Optimization"]
              },
              {
                icon: Briefcase,
                title: "Trading & Supply",
                desc: "Premium construction materials, equipment, and safety gear sourced from trusted global suppliers with quality assurance.",
                features: ["Construction Materials", "Heavy Equipment", "Safety Gear", "Technical Supplies"]
              },
              {
                icon: Factory,
                title: "Industrial Solutions",
                desc: "Specialized services for oil & gas, petrochemical, and industrial sectors with focus on safety and compliance.",
                features: ["Oil & Gas Projects", "Industrial Facilities", "Process Equipment", "Safety Systems"]
              }
            ].map((capability, i) => (
              <div key={i} className="group relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <capability.icon className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 transition-colors duration-500">
                    {capability.title}
                  </h3>
                  
                  <p className="text-[#7f8994] group-hover:text-white/90 mb-6 transition-colors duration-500">
                    {capability.desc}
                  </p>
                  
                  <ul className="space-y-2">
                    {capability.features.map((feature, j) => (
                      <li key={j} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="text-[#f1601f] group-hover:text-white flex-shrink-0" size={16} />
                        <span className="text-[#7f8994] group-hover:text-white/90 transition-colors duration-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Accreditations */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Quality & Compliance</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
              Certifications & Accreditations
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Our commitment to excellence is validated by international certifications and industry recognitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Award,
                title: "ISO 9001:2015",
                subtitle: "Quality Management",
                desc: "International standard for quality management systems ensuring consistent service delivery"
              },
              {
                icon: Shield,
                title: "OHSAS 18001",
                subtitle: "Health & Safety",
                desc: "Occupational health and safety management certification for zero-harm workplace"
              },
              {
                icon: Star,
                title: "Grade 1 License",
                subtitle: "Premium Contractor",
                desc: "Highest grade contractor license for large-scale and complex project execution"
              },
              {
                icon: Target,
                title: "ISO 14001",
                subtitle: "Environmental",
                desc: "Environmental management system certification for sustainable practices"
              }
            ].map((cert, i) => (
              <div key={i} className="group bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-[#f1601f] group-hover:to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 transition-all duration-500">
                  <cert.icon className="text-[#0b1d34] group-hover:text-white transition-colors duration-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-[#0b1d34] mb-2">{cert.title}</h3>
                <div className="text-sm font-bold text-[#f1601f] mb-4">{cert.subtitle}</div>
                <p className="text-[#7f8994] leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-3xl p-12 text-white text-center">
            <h3 className="text-3xl font-black mb-6">Trusted by Leading Organizations</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We have established strong partnerships with over 50 major clients across various sectors, delivering projects that set industry benchmarks for quality and excellence.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-black text-[#f1601f] mb-2">100%</div>
                <div className="text-gray-300">Client Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-5xl font-black text-[#f1601f] mb-2">98%</div>
                <div className="text-gray-300">On-Time Delivery</div>
              </div>
              <div>
                <div className="text-5xl font-black text-[#f1601f] mb-2">Zero</div>
                <div className="text-gray-300">Major Safety Incidents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Sectors */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Where We Work</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
              Serving Diverse Industries
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Extensive experience delivering projects across multiple sectors throughout the Gulf region
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Oil & Gas",
                projects: "150+",
                img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
                desc: "Refineries, processing plants, and storage facilities"
              },
              {
                name: "Infrastructure",
                projects: "200+",
                img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop",
                desc: "Roads, bridges, and transportation networks"
              },
              {
                name: "Commercial",
                projects: "250+",
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
                desc: "Office buildings, retail centers, and hospitality"
              },
              {
                name: "Industrial",
                projects: "180+",
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
                desc: "Manufacturing facilities and warehouses"
              },
              {
                name: "Residential",
                projects: "120+",
                img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
                desc: "Luxury villas and residential complexes"
              },
              {
                name: "Healthcare",
                projects: "90+",
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
                desc: "Hospitals and medical facilities"
              }
            ].map((sector, i) => (
              <div key={i} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                <img src={sector.img} alt={sector.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:from-[#f1601f]/90 group-hover:via-[#f1601f]/70 transition-all duration-500"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform group-hover:-translate-y-4 transition-transform duration-500">
                    <div className="text-white/80 font-bold text-sm mb-2">{sector.projects} Projects Completed</div>
                    <h3 className="text-3xl font-black text-white mb-2">{sector.name}</h3>
                    <p className="text-white/90 text-sm">{sector.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose RAWASY */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Competitive Advantages</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
              Why Choose RAWASY
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Proven Track Record",
                  desc: "Over 15 years of successful project delivery with 800+ completed projects across the Gulf region, demonstrating consistent excellence and reliability."
                },
                {
                  icon: Users,
                  title: "Skilled Workforce",
                  desc: "Access to 2000+ certified professionals including engineers, technicians, and skilled craftsmen, ensuring expertise across all project requirements."
                },
                {
                  icon: Shield,
                  title: "Safety Excellence",
                  desc: "OHSAS 18001 certified with zero-harm workplace culture, comprehensive safety protocols, and regular training programs for all personnel."
                },
                {
                  icon: Clock,
                  title: "On-Time Delivery",
                  desc: "98% on-time project completion rate through advanced project management systems, efficient resource allocation, and proactive planning."
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0b1d34] mb-3">{item.title}</h3>
                    <p className="text-[#7f8994] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-10">
                <h3 className="text-2xl font-black text-[#0b1d34] mb-8">Our Differentiators</h3>
                <ul className="space-y-6">
                  {[
                    "Comprehensive end-to-end solutions from design to execution",
                    "Multi-disciplinary expertise across all construction sectors",
                    "Advanced technology and modern equipment fleet",
                    "Strong supplier and subcontractor network",
                    "Flexible workforce deployment capabilities",
                    "ISO certified quality management systems",
                    "Competitive pricing with no compromise on quality",
                    "Dedicated project management and support teams"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle className="text-[#f1601f] flex-shrink-0 mt-1" size={20} />
                      <span className="text-[#7f8994] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24  bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Partner with <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Excellence</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's discuss how RAWASY can bring your vision to life with our proven expertise, dedicated workforce, and commitment to quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/contact" className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3">
              <span>Get in Touch</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a href="/projects" className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center">
              View Our Projects
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
              <div className="text-gray-400">Gulf Region, UAE</div>
            </div>
          </div>
        </div>
      </section>



      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
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

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default RawasyAboutPage;